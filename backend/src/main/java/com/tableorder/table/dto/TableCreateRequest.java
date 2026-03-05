package com.tableorder.table.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class TableCreateRequest {
    @Positive
    private int tableNumber;

    @NotBlank
    private String password;
}
