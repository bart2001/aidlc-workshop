package com.tableorder.table.entity;

import com.tableorder.store.entity.Store;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "store_table",
       uniqueConstraints = @UniqueConstraint(columns = {"store_id", "table_number"}))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class StoreTable {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @Column(name = "table_number", nullable = false)
    private int tableNumber;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public StoreTable(Store store, int tableNumber, String passwordHash) {
        this.store = store;
        this.tableNumber = tableNumber;
        this.passwordHash = passwordHash;
    }

    public void update(int tableNumber, String passwordHash) {
        this.tableNumber = tableNumber;
        if (passwordHash != null) {
            this.passwordHash = passwordHash;
        }
    }

    @PrePersist
    protected void onCreate() { createdAt = updatedAt = LocalDateTime.now(); }

    @PreUpdate
    protected void onUpdate() { updatedAt = LocalDateTime.now(); }
}
