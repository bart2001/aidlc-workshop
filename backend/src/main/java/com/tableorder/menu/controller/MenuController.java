package com.tableorder.menu.controller;

import com.tableorder.common.dto.ApiResponse;
import com.tableorder.menu.dto.*;
import com.tableorder.menu.service.MenuService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stores/{storeId}")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

    // ── 카테고리 ──

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getCategories(
            @PathVariable Long storeId) {
        return ResponseEntity.ok(ApiResponse.ok(menuService.getCategories(storeId)));
    }

    @PostMapping("/categories")
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(
            @PathVariable Long storeId, @Valid @RequestBody CategoryCreateRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(menuService.createCategory(storeId, req)));
    }

    @PutMapping("/categories/{categoryId}")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
            @PathVariable Long storeId, @PathVariable Long categoryId,
            @Valid @RequestBody CategoryUpdateRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(menuService.updateCategory(storeId, categoryId, req)));
    }

    @DeleteMapping("/categories/{categoryId}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(
            @PathVariable Long storeId, @PathVariable Long categoryId) {
        menuService.deleteCategory(storeId, categoryId);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    // ── 메뉴 ──

    @GetMapping("/menus")
    public ResponseEntity<ApiResponse<List<MenuItemResponse>>> getMenuItems(
            @PathVariable Long storeId,
            @RequestParam(required = false) Long categoryId) {
        return ResponseEntity.ok(ApiResponse.ok(menuService.getMenuItems(storeId, categoryId)));
    }

    @GetMapping("/menus/{menuId}")
    public ResponseEntity<ApiResponse<MenuItemResponse>> getMenuItem(
            @PathVariable Long storeId, @PathVariable Long menuId) {
        return ResponseEntity.ok(ApiResponse.ok(menuService.getMenuItem(storeId, menuId)));
    }

    @PostMapping("/menus")
    public ResponseEntity<ApiResponse<MenuItemResponse>> createMenuItem(
            @PathVariable Long storeId, @Valid @RequestBody MenuItemCreateRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(menuService.createMenuItem(storeId, req)));
    }

    @PutMapping("/menus/{menuId}")
    public ResponseEntity<ApiResponse<MenuItemResponse>> updateMenuItem(
            @PathVariable Long storeId, @PathVariable Long menuId,
            @Valid @RequestBody MenuItemUpdateRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(menuService.updateMenuItem(storeId, menuId, req)));
    }

    @DeleteMapping("/menus/{menuId}")
    public ResponseEntity<ApiResponse<Void>> deleteMenuItem(
            @PathVariable Long storeId, @PathVariable Long menuId) {
        menuService.deleteMenuItem(storeId, menuId);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    @PatchMapping("/menus/{menuId}")
    public ResponseEntity<ApiResponse<MenuItemResponse>> updateMenuItemOrder(
            @PathVariable Long storeId, @PathVariable Long menuId,
            @RequestBody Map<String, Integer> body) {
        return ResponseEntity.ok(ApiResponse.ok(
                menuService.updateMenuItemOrder(storeId, menuId, body.get("displayOrder"))));
    }
}
