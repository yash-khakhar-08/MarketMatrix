package com.springboot.events;

import java.util.List;

import com.springboot.models.Orders;

public class OrderPlacedEvent {

    private List<Orders> orders;

    public OrderPlacedEvent(List<Orders> orders) {
        this.orders = orders;
    }

    public OrderPlacedEvent(){}

    public List<Orders> getOrders() {
        return orders;
    }

}
