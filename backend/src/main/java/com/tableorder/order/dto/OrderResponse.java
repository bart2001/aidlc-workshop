package com.tableorder.order.dto;

import com.tableorder.order.entity.Order;
import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private int orderNumber;
    private String status;
    private int totalAmount;
    private Long tableId;
    private int tableNumber;
    private List<ItemResponse> items;
    private LocalDateTime createdAt;

    @Getter
    @AllArgsConstructor
    public static class ItemResponse {
        private Long id;
        private String menuName;
        private int quantity;
        private int unitPrice;
    }

    public static OrderResponse from(Order order) {
        List<ItemResponse> items = order.getItems().stream()
                .map(i -> new ItemResponse(i.getId(), i.getMenuName(), i.getQuantity(), i.getUnitPrice()))
                .toList();
        return new OrderResponse(
                order.getId(), order.getOrderNumber(), order.getStatus().name(),
                order.getTotalAmount(), order.getTable().getId(),
                order.getTable().getTableNumber(), items, order.getCreatedAt());
    }
}
