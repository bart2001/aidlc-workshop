package com.tableorder.order.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tableorder.order.dto.OrderEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderSseService {

    private static final long SSE_TIMEOUT = 1_800_000L; // 30분

    private final ConcurrentHashMap<Long, CopyOnWriteArrayList<SseEmitter>> storeEmitters = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, CopyOnWriteArrayList<SseEmitter>> tableEmitters = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper;

    public SseEmitter subscribeStoreOrders(Long storeId) {
        SseEmitter emitter = createEmitter();
        storeEmitters.computeIfAbsent(storeId, k -> new CopyOnWriteArrayList<>()).add(emitter);
        registerCallbacks(emitter, () -> removeStoreEmitter(storeId, emitter));
        return emitter;
    }

    public SseEmitter subscribeTableOrders(Long storeId, Long tableId) {
        String key = storeId + ":" + tableId;
        SseEmitter emitter = createEmitter();
        tableEmitters.computeIfAbsent(key, k -> new CopyOnWriteArrayList<>()).add(emitter);
        registerCallbacks(emitter, () -> removeTableEmitter(key, emitter));
        return emitter;
    }

    public void publishOrderEvent(Long storeId, OrderEvent event) {
        sendToEmitters(storeEmitters.get(storeId), event, storeId);
        if (event.getTableId() != null) {
            String key = storeId + ":" + event.getTableId();
            sendToEmitters(tableEmitters.get(key), event, key);
        }
    }

    private SseEmitter createEmitter() {
        return new SseEmitter(SSE_TIMEOUT);
    }

    private void registerCallbacks(SseEmitter emitter, Runnable cleanup) {
        emitter.onCompletion(cleanup);
        emitter.onTimeout(cleanup);
        emitter.onError(e -> cleanup.run());
    }

    private void sendToEmitters(CopyOnWriteArrayList<SseEmitter> emitters, OrderEvent event, Object key) {
        if (emitters == null) return;
        emitters.forEach(emitter -> {
            try {
                emitter.send(SseEmitter.event()
                        .name(event.getType())
                        .data(objectMapper.writeValueAsString(event)));
            } catch (IOException e) {
                log.debug("SSE 전송 실패, emitter 제거: {}", key);
                emitters.remove(emitter);
            }
        });
    }

    private void removeStoreEmitter(Long storeId, SseEmitter emitter) {
        var list = storeEmitters.get(storeId);
        if (list != null) list.remove(emitter);
    }

    private void removeTableEmitter(String key, SseEmitter emitter) {
        var list = tableEmitters.get(key);
        if (list != null) list.remove(emitter);
    }
}
