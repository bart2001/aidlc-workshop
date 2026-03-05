package com.tableorder.order.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter @Setter
public class OrderCreateRequest {
    @NotNull
    private Long tableId;

    @NotEmpty
    private List<OrderItemRequest> items;
}
