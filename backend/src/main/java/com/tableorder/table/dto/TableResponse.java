package com.tableorder.table.dto;

import com.tableorder.table.entity.StoreTable;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TableResponse {
    private Long id;
    private int tableNumber;

    public static TableResponse from(StoreTable t) {
        return new TableResponse(t.getId(), t.getTableNumber());
    }
}
