package com.tableorder.table.service;

import com.tableorder.common.exception.BusinessException;
import com.tableorder.common.exception.ErrorCode;
import com.tableorder.store.entity.Store;
import com.tableorder.store.repository.StoreRepository;
import com.tableorder.table.dto.*;
import com.tableorder.table.entity.StoreTable;
import com.tableorder.table.entity.TableSession;
import com.tableorder.table.repository.TableRepository;
import com.tableorder.table.repository.TableSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TableService {

    private final TableRepository tableRepository;
    private final TableSessionRepository tableSessionRepository;
    private final StoreRepository storeRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<TableResponse> getTables(Long storeId) {
        return tableRepository.findByStoreId(storeId)
                .stream().map(TableResponse::from).toList();
    }

    public TableResponse createTable(Long storeId, TableCreateRequest req) {
        Store store = findStore(storeId);
        StoreTable table = new StoreTable(store, req.getTableNumber(),
                passwordEncoder.encode(req.getPassword()));
        return TableResponse.from(tableRepository.save(table));
    }

    public TableResponse updateTable(Long storeId, Long tableId, TableUpdateRequest req) {
        StoreTable table = tableRepository.findByIdAndStoreId(tableId, storeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.TABLE_NOT_FOUND));
        String encodedPw = req.getPassword() != null ? passwordEncoder.encode(req.getPassword()) : null;
        table.update(req.getTableNumber(), encodedPw);
        return TableResponse.from(table);
    }

    @Transactional(readOnly = true)
    public TableSessionResponse getActiveSession(Long storeId, Long tableId) {
        TableSession session = tableSessionRepository.findByTableIdAndActiveTrue(tableId)
                .orElse(null);
        return session != null ? TableSessionResponse.from(session) : null;
    }

    /**
     * 첫 주문 시 자동 호출 (OrderService에서 사용)
     */
    public TableSession startNewSession(Long storeId, Long tableId) {
        StoreTable table = tableRepository.findByIdAndStoreId(tableId, storeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.TABLE_NOT_FOUND));
        Store store = findStore(storeId);
        TableSession session = new TableSession(table, store);
        return tableSessionRepository.save(session);
    }

    /**
     * 이용 완료 처리 - OrderService.archiveSessionOrders() 호출 후 세션 종료
     */
    public void completeSession(Long storeId, Long tableId, Long sessionId) {
        TableSession session = tableSessionRepository.findById(sessionId)
                .filter(s -> s.getTable().getId().equals(tableId) && s.isActive())
                .orElseThrow(() -> new BusinessException(ErrorCode.SESSION_NOT_FOUND));
        session.complete();
    }

    /**
     * 활성 세션 엔티티 반환 (OrderService에서 사용)
     */
    @Transactional(readOnly = true)
    public TableSession getActiveSessionEntity(Long tableId) {
        return tableSessionRepository.findByTableIdAndActiveTrue(tableId).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<TableSessionResponse> getSessions(Long storeId, Long tableId) {
        return tableSessionRepository.findByTableIdOrderByStartedAtDesc(tableId)
                .stream().map(TableSessionResponse::from).toList();
    }

    private Store findStore(Long storeId) {
        return storeRepository.findById(storeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.STORE_NOT_FOUND));
    }
}
