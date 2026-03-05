package com.tableorder.menu.dto;

import com.tableorder.menu.entity.MenuItem;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MenuItemResponse {
    private Long id;
    private Long categoryId;
    private String name;
    private int price;
    private String description;
    private String imageUrl;
    private int displayOrder;

    public static MenuItemResponse from(MenuItem m) {
        return new MenuItemResponse(
                m.getId(), m.getCategory().getId(), m.getName(),
                m.getPrice(), m.getDescription(), m.getImageUrl(), m.getDisplayOrder());
    }
}
