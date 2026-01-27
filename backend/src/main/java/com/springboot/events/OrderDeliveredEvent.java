package com.springboot.events;

import com.springboot.models.Orders;

public class OrderDeliveredEvent {
    
    private final Orders order;

    public OrderDeliveredEvent(Orders order) {
        this.order = order;
    }

    public Orders getOrder() {
        return order;
    }

}
