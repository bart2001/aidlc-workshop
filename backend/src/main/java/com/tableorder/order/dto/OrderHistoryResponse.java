package com.tableorder.order.dto;

import com.tableorder.order.entity.OrderHistory;
import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class OrderHistoryResponse {
    private Long id;
    private Long sessionId;
    private String orderDataJson;
    private int totalAmount;
    private LocalDateTime completedAt;

    public static OrderHistoryResponse from(OrderHistory h) {
        return new OrderHistoryResponse(
                h.getId(), h.getSessionId(), h.getOrderDataJson(),
                h.getTotalAmount(), h.getCompletedAt());
    }
}
