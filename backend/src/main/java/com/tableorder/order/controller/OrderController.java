package com.tableorder.order.controller;

import com.tableorder.common.dto.ApiResponse;
import com.tableorder.order.dto.*;
import com.tableorder.order.entity.OrderStatus;
import com.tableorder.order.service.OrderService;
import com.tableorder.order.service.OrderSseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stores/{storeId}")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final OrderSseService orderSseService;

    @PostMapping("/orders")
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @PathVariable Long storeId, @Valid @RequestBody OrderCreateRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.createOrder(storeId, req)));
    }

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrders(
            @PathVariable Long storeId,
            @RequestParam(required = false) Long sessionId) {
        if (sessionId != null) {
            return ResponseEntity.ok(ApiResponse.ok(orderService.getOrdersBySession(storeId, sessionId)));
        }
        return ResponseEntity.ok(ApiResponse.ok(orderService.getActiveOrders(storeId)));
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrder(
            @PathVariable Long storeId, @PathVariable Long orderId) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getOrder(storeId, orderId)));
    }

    @PatchMapping("/orders/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long storeId, @PathVariable Long orderId,
            @RequestBody Map<String, String> body) {
        OrderStatus newStatus = OrderStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(ApiResponse.ok(orderService.updateOrderStatus(storeId, orderId, newStatus)));
    }

    @DeleteMapping("/orders/{orderId}")
    public ResponseEntity<ApiResponse<Void>> deleteOrder(
            @PathVariable Long storeId, @PathVariable Long orderId) {
        orderService.deleteOrder(storeId, orderId);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    @GetMapping("/tables/{tableId}/order-history")
    public ResponseEntity<ApiResponse<List<OrderHistoryResponse>>> getOrderHistory(
            @PathVariable Long storeId, @PathVariable Long tableId) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getOrderHistory(storeId, tableId)));
    }

    // ── SSE ──

    @GetMapping(value = "/orders/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribeStoreOrders(@PathVariable Long storeId) {
        return orderSseService.subscribeStoreOrders(storeId);
    }

    @GetMapping(value = "/tables/{tableId}/orders/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribeTableOrders(
            @PathVariable Long storeId, @PathVariable Long tableId) {
        return orderSseService.subscribeTableOrders(storeId, tableId);
    }
}
