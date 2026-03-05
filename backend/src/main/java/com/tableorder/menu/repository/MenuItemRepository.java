package com.tableorder.menu.repository;

import com.tableorder.menu.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByStoreIdAndCategoryIdOrderByDisplayOrder(Long storeId, Long categoryId);
    List<MenuItem> findByStoreIdOrderByDisplayOrder(Long storeId);
    Optional<MenuItem> findByIdAndStoreId(Long id, Long storeId);
    boolean existsByCategoryId(Long categoryId);
}
