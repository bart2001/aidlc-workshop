package com.tableorder.order.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class OrderItemRequest {
    @NotNull
    private Long menuItemId;

    @Positive
    private int quantity;
}
