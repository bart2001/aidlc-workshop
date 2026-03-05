package com.tableorder.table.repository;

import com.tableorder.table.entity.StoreTable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TableRepository extends JpaRepository<StoreTable, Long> {

    Optional<StoreTable> findByStoreIdAndTableNumber(Long storeId, int tableNumber);

    Optional<StoreTable> findByIdAndStoreId(Long id, Long storeId);

    List<StoreTable> findByStoreId(Long storeId);
}
