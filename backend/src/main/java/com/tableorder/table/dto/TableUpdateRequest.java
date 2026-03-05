package com.tableorder.table.dto;

import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class TableUpdateRequest {
    @Positive
    private int tableNumber;

    private String password; // nullable: 변경하지 않을 경우
}
