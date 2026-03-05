package com.tableorder.store.dto;

import com.tableorder.store.entity.Store;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StoreResponse {

    private Long id;
    private String name;

    public static StoreResponse from(Store store) {
        return new StoreResponse(store.getId(), store.getName());
    }
}
