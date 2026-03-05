package com.tableorder.menu.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class MenuItemCreateRequest {
    @NotNull
    private Long categoryId;

    @NotBlank @Size(max = 100)
    private String name;

    @Min(0) @Max(10_000_000)
    private int price;

    @Size(max = 1000)
    private String description;

    @Size(max = 500)
    private String imageUrl;

    @Min(0)
    private int displayOrder;
}
