package com.tableorder.order.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tableorder.common.exception.BusinessException;
import com.tableorder.common.exception.ErrorCode;
import com.tableorder.menu.entity.MenuItem;
import com.tableorder.menu.repository.MenuItemRepository;
import com.tableorder.order.dto.*;
import com.tableorder.order.entity.*;
import com.tableorder.order.repository.OrderHistoryRepository;
import com.tableorder.order.repository.OrderRepository;
import com.tableorder.store.entity.Store;
import com.tableorder.store.repository.StoreRepository;
import com.tableorder.table.entity.StoreTable;
import com.tableorder.table.entity.TableSession;
import com.tableorder.table.repository.TableRepository;
import com.tableorder.table.service.TableService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderHistoryRepository orderHistoryRepository;
    private final MenuItemRepository menuItemRepository;
    private final StoreRepository storeRepository;
    private final TableRepository tableRepository;
    private final TableService tableService;
    private final OrderSseService orderSseService;
    private final ObjectMapper objectMapper;

    public OrderResponse createOrder(Long storeId, OrderCreateRequest request) {
        Store store = findStore(storeId);
        StoreTable table = tableRepository.findByIdAndStoreId(request.getTableId(), storeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.TABLE_NOT_FOUND));

        // 활성 세션 확인 또는 새 세션 시작
        TableSession session = tableService.getActiveSessionEntity(table.getId());
        if (session == null) {
            session = tableService.startNewSession(storeId, table.getId());
        }

        // 주문번호 생성 (낙관적 재시도)
        int orderNumber = generateOrderNumber(storeId);

        // 주문 항목 생성 및 총액 계산
        int totalAmount = 0;
        List<OrderItem> items = new ArrayList<>();
        for (OrderItemRequest itemReq : request.getItems()) {
            MenuItem menuItem = menuItemRepository.findByIdAndStoreId(itemReq.getMenuItemId(), storeId)
                    .orElseThrow(() -> new BusinessException(ErrorCode.MENU_NOT_FOUND));
            OrderItem orderItem = new OrderItem(menuItem, menuItem.getName(),
                    itemReq.getQuantity(), menuItem.getPrice());
            items.add(orderItem);
            totalAmount += menuItem.getPrice() * itemReq.getQuantity();
        }

        Order order = new Order(store, table, session, orderNumber, totalAmount);
        items.forEach(order::addItem);
        orderRepository.save(order);

        OrderResponse response = OrderResponse.from(order);
        orderSseService.publishOrderEvent(storeId,
                new OrderEvent("ORDER_CREATED", storeId, table.getId(), response));
        return response;
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersBySession(Long storeId, Long sessionId) {
        return orderRepository.findByStoreIdAndSessionIdOrderByCreatedAtAsc(storeId, sessionId)
                .stream().map(OrderResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getActiveOrders(Long storeId) {
        return orderRepository.findActiveOrdersByStoreId(storeId)
                .stream().map(OrderResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrder(Long storeId, Long orderId) {
        Order order = findOrder(storeId, orderId);
        return OrderResponse.from(order);
    }

    public OrderResponse updateOrderStatus(Long storeId, Long orderId, OrderStatus newStatus) {
        Order order = findOrder(storeId, orderId);
        if (!order.getStatus().canTransitionTo(newStatus)) {
            throw new BusinessException(ErrorCode.INVALID_ORDER_STATUS,
                    order.getStatus() + " → " + newStatus + " 전이는 허용되지 않습니다");
        }
        order.updateStatus(newStatus);

        OrderResponse response = OrderResponse.from(order);
        orderSseService.publishOrderEvent(storeId,
                new OrderEvent("ORDER_STATUS_CHANGED", storeId, order.getTable().getId(), response));
        return response;
    }

    public void deleteOrder(Long storeId, Long orderId) {
        Order order = findOrder(storeId, orderId);
        Long tableId = order.getTable().getId();
        orderRepository.delete(order);

        orderSseService.publishOrderEvent(storeId,
                new OrderEvent("ORDER_DELETED", storeId, tableId, Map.of("orderId", orderId)));
    }

    /**
     * 세션 종료 시 주문을 OrderHistory로 이동 후 삭제
     * TableController.completeSession()에서 호출
     */
    public void archiveSessionOrders(Long storeId, Long sessionId) {
        List<Order> orders = orderRepository.findBySessionId(sessionId);
        if (orders.isEmpty()) return;

        try {
            Order firstOrder = orders.get(0);
            Store store = firstOrder.getStore();
            StoreTable table = firstOrder.getTable();
            int totalAmount = orders.stream().mapToInt(Order::getTotalAmount).sum();
            String json = objectMapper.writeValueAsString(buildOrderDataJson(orders));

            OrderHistory history = new OrderHistory(store, table, sessionId, json, totalAmount);
            orderHistoryRepository.save(history);
            orderRepository.deleteAll(orders);
        } catch (Exception e) {
            log.error("주문 이력 저장 실패: sessionId={}", sessionId, e);
            throw new RuntimeException("주문 이력 저장에 실패했습니다", e);
        }
    }

    @Transactional(readOnly = true)
    public List<OrderHistoryResponse> getOrderHistory(Long storeId, Long tableId) {
        return orderHistoryRepository.findByStoreIdAndTableIdOrderByCompletedAtDesc(storeId, tableId)
                .stream().map(OrderHistoryResponse::from).toList();
    }

    // ── private ──

    private int generateOrderNumber(Long storeId) {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX);

        for (int retry = 0; retry < 3; retry++) {
            int maxNumber = orderRepository.findMaxOrderNumber(storeId, startOfDay, endOfDay);
            return maxNumber + 1;
        }
        throw new BusinessException(ErrorCode.ORDER_NUMBER_GENERATION_FAILED);
    }

    private Map<String, Object> buildOrderDataJson(List<Order> orders) {
        List<Map<String, Object>> orderList = orders.stream().map(o -> {
            List<Map<String, Object>> items = o.getItems().stream().map(i -> Map.<String, Object>of(
                    "menuName", i.getMenuName(),
                    "quantity", i.getQuantity(),
                    "unitPrice", i.getUnitPrice()
            )).toList();
            return Map.<String, Object>of(
                    "orderNumber", o.getOrderNumber(),
                    "status", o.getStatus().name(),
                    "totalAmount", o.getTotalAmount(),
                    "createdAt", o.getCreatedAt().toString(),
                    "items", items
            );
        }).toList();

        int sessionTotal = orders.stream().mapToInt(Order::getTotalAmount).sum();
        return Map.of(
                "orders", orderList,
                "sessionTotalAmount", sessionTotal,
                "orderCount", orders.size()
        );
    }

    private Store findStore(Long storeId) {
        return storeRepository.findById(storeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.STORE_NOT_FOUND));
    }

    private Order findOrder(Long storeId, Long orderId) {
        return orderRepository.findByIdAndStoreId(orderId, storeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ORDER_NOT_FOUND));
    }
}
