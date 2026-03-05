package com.tableorder.table.entity;

import com.tableorder.store.entity.Store;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "table_session")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TableSession {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "table_id", nullable = false)
    private StoreTable table;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @Column(name = "started_at", nullable = false, updatable = false)
    private LocalDateTime startedAt;

    @Column(name = "ended_at")
    private LocalDateTime endedAt;

    public TableSession(StoreTable table, Store store) {
        this.table = table;
        this.store = store;
    }

    public void complete() {
        this.active = false;
        this.endedAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() { startedAt = LocalDateTime.now(); }
}
