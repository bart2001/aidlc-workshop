package com.tableorder.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TableLoginResponse {

    private String token;
    private Long storeId;
    private Long tableId;
    private int tableNumber;
}
