package com.springboot.events;

import com.springboot.models.Orders;

public class OrderCancelEvent {
    
    private final Orders order;

    public OrderCancelEvent(Orders order) {
        this.order = order;
    }

    public Orders getOrder() {
        return order;
    }

}
