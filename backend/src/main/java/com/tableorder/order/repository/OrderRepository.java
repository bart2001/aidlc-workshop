package com.tableorder.order.repository;

import com.tableorder.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByStoreIdAndSessionIdOrderByCreatedAtAsc(Long storeId, Long sessionId);

    @Query("SELECT o FROM Order o WHERE o.store.id = :storeId AND o.status <> 'COMPLETED' ORDER BY o.createdAt DESC")
    List<Order> findActiveOrdersByStoreId(@Param("storeId") Long storeId);

    Optional<Order> findByIdAndStoreId(Long id, Long storeId);

    @Query("SELECT COALESCE(MAX(o.orderNumber), 0) FROM Order o " +
           "WHERE o.store.id = :storeId AND o.createdAt >= :startOfDay AND o.createdAt < :endOfDay")
    int findMaxOrderNumber(@Param("storeId") Long storeId,
                           @Param("startOfDay") LocalDateTime startOfDay,
                           @Param("endOfDay") LocalDateTime endOfDay);

    List<Order> findBySessionId(Long sessionId);
}
