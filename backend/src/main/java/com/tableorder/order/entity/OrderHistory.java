package com.tableorder.order.entity;

import com.tableorder.store.entity.Store;
import com.tableorder.table.entity.StoreTable;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "order_history")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OrderHistory {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "table_id", nullable = false)
    private StoreTable table;

    @Column(name = "session_id", nullable = false)
    private Long sessionId; // FK 아님, 값만 보존

    @Column(name = "order_data_json", nullable = false, columnDefinition = "jsonb")
    private String orderDataJson;

    @Column(name = "total_amount", nullable = false)
    private int totalAmount;

    @Column(name = "completed_at", nullable = false, updatable = false)
    private LocalDateTime completedAt;

    public OrderHistory(Store store, StoreTable table, Long sessionId,
                        String orderDataJson, int totalAmount) {
        this.store = store;
        this.table = table;
        this.sessionId = sessionId;
        this.orderDataJson = orderDataJson;
        this.totalAmount = totalAmount;
    }

    @PrePersist
    protected void onCreate() { completedAt = LocalDateTime.now(); }
}
