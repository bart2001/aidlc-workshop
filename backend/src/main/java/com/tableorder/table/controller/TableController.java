package com.tableorder.table.controller;

import com.tableorder.common.dto.ApiResponse;
import com.tableorder.order.dto.OrderEvent;
import com.tableorder.order.service.OrderService;
import com.tableorder.order.service.OrderSseService;
import com.tableorder.table.dto.*;
import com.tableorder.table.service.TableService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stores/{storeId}/tables")
@RequiredArgsConstructor
public class TableController {

    private final TableService tableService;
    private final OrderService orderService;
    private final OrderSseService orderSseService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TableResponse>>> getTables(
            @PathVariable Long storeId) {
        return ResponseEntity.ok(ApiResponse.ok(tableService.getTables(storeId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TableResponse>> createTable(
            @PathVariable Long storeId, @Valid @RequestBody TableCreateRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(tableService.createTable(storeId, req)));
    }

    @PutMapping("/{tableId}")
    public ResponseEntity<ApiResponse<TableResponse>> updateTable(
            @PathVariable Long storeId, @PathVariable Long tableId,
            @Valid @RequestBody TableUpdateRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(tableService.updateTable(storeId, tableId, req)));
    }

    @GetMapping("/{tableId}/sessions")
    public ResponseEntity<ApiResponse<List<TableSessionResponse>>> getSessions(
            @PathVariable Long storeId, @PathVariable Long tableId) {
        return ResponseEntity.ok(ApiResponse.ok(tableService.getSessions(storeId, tableId)));
    }

    @PatchMapping("/{tableId}/sessions/{sessionId}")
    public ResponseEntity<ApiResponse<Void>> completeSession(
            @PathVariable Long storeId, @PathVariable Long tableId,
            @PathVariable Long sessionId) {
        // 1. 주문 이력 이동
        orderService.archiveSessionOrders(storeId, sessionId);
        // 2. 세션 종료
        tableService.completeSession(storeId, tableId, sessionId);
        // 3. SSE 이벤트 발행
        orderSseService.publishOrderEvent(storeId,
                new OrderEvent("SESSION_COMPLETED", storeId, tableId, null));
        return ResponseEntity.ok(ApiResponse.ok());
    }
}
