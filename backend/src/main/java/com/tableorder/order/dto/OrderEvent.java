package com.tableorder.order.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class OrderEvent {
    private String type; // ORDER_CREATED, ORDER_STATUS_CHANGED, ORDER_DELETED, SESSION_COMPLETED
    private Long storeId;
    private Long tableId;
    private Object data;
}
