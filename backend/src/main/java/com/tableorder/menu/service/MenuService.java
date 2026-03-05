package com.tableorder.menu.service;

import com.tableorder.common.exception.BusinessException;
import com.tableorder.common.exception.ErrorCode;
import com.tableorder.menu.dto.*;
import com.tableorder.menu.entity.Category;
import com.tableorder.menu.entity.MenuItem;
import com.tableorder.menu.repository.CategoryRepository;
import com.tableorder.menu.repository.MenuItemRepository;
import com.tableorder.store.entity.Store;
import com.tableorder.store.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MenuService {

    private final MenuItemRepository menuItemRepository;
    private final CategoryRepository categoryRepository;
    private final StoreRepository storeRepository;

    // ── 카테고리 ──

    @Transactional(readOnly = true)
    public List<CategoryResponse> getCategories(Long storeId) {
        return categoryRepository.findByStoreIdOrderByDisplayOrder(storeId)
                .stream().map(CategoryResponse::from).toList();
    }

    public CategoryResponse createCategory(Long storeId, CategoryCreateRequest req) {
        Store store = findStore(storeId);
        Category category = new Category(store, req.getName(), req.getDisplayOrder());
        return CategoryResponse.from(categoryRepository.save(category));
    }

    public CategoryResponse updateCategory(Long storeId, Long categoryId, CategoryUpdateRequest req) {
        Category category = categoryRepository.findByIdAndStoreId(categoryId, storeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CATEGORY_NOT_FOUND));
        category.update(req.getName(), req.getDisplayOrder());
        return CategoryResponse.from(category);
    }

    public void deleteCategory(Long storeId, Long categoryId) {
        Category category = categoryRepository.findByIdAndStoreId(categoryId, storeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CATEGORY_NOT_FOUND));
        if (menuItemRepository.existsByCategoryId(categoryId)) {
            throw new BusinessException(ErrorCode.CATEGORY_HAS_MENU);
        }
        categoryRepository.delete(category);
    }

    // ── 메뉴 ──

    @Transactional(readOnly = true)
    public List<MenuItemResponse> getMenuItems(Long storeId, Long categoryId) {
        if (categoryId != null) {
            return menuItemRepository.findByStoreIdAndCategoryIdOrderByDisplayOrder(storeId, categoryId)
                    .stream().map(MenuItemResponse::from).toList();
        }
        return menuItemRepository.findByStoreIdOrderByDisplayOrder(storeId)
                .stream().map(MenuItemResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public MenuItemResponse getMenuItem(Long storeId, Long menuId) {
        return MenuItemResponse.from(findMenuItem(storeId, menuId));
    }

    public MenuItemResponse createMenuItem(Long storeId, MenuItemCreateRequest req) {
        Store store = findStore(storeId);
        Category category = categoryRepository.findByIdAndStoreId(req.getCategoryId(), storeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CATEGORY_NOT_FOUND));
        MenuItem item = new MenuItem(store, category, req.getName(), req.getPrice(),
                req.getDescription(), req.getImageUrl(), req.getDisplayOrder());
        return MenuItemResponse.from(menuItemRepository.save(item));
    }

    public MenuItemResponse updateMenuItem(Long storeId, Long menuId, MenuItemUpdateRequest req) {
        MenuItem item = findMenuItem(storeId, menuId);
        Category category = categoryRepository.findByIdAndStoreId(req.getCategoryId(), storeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CATEGORY_NOT_FOUND));
        item.update(category, req.getName(), req.getPrice(),
                req.getDescription(), req.getImageUrl(), req.getDisplayOrder());
        return MenuItemResponse.from(item);
    }

    public void deleteMenuItem(Long storeId, Long menuId) {
        MenuItem item = findMenuItem(storeId, menuId);
        menuItemRepository.delete(item);
    }

    public MenuItemResponse updateMenuItemOrder(Long storeId, Long menuId, int displayOrder) {
        MenuItem item = findMenuItem(storeId, menuId);
        item.updateDisplayOrder(displayOrder);
        return MenuItemResponse.from(item);
    }

    // ── private ──

    private Store findStore(Long storeId) {
        return storeRepository.findById(storeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.STORE_NOT_FOUND));
    }

    private MenuItem findMenuItem(Long storeId, Long menuId) {
        return menuItemRepository.findByIdAndStoreId(menuId, storeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MENU_NOT_FOUND));
    }
}
