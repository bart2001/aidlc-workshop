package com.tableorder.order.entity;

import com.tableorder.menu.entity.MenuItem;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "order_item")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OrderItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_item_id")
    private MenuItem menuItem; // nullable: 메뉴 삭제 시 SET NULL

    @Column(name = "menu_name", nullable = false, length = 100)
    private String menuName;

    @Column(nullable = false)
    private int quantity;

    @Column(name = "unit_price", nullable = false)
    private int unitPrice;

    public OrderItem(MenuItem menuItem, String menuName, int quantity, int unitPrice) {
        this.menuItem = menuItem;
        this.menuName = menuName;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    void setOrder(Order order) {
        this.order = order;
    }
}
