package com.springboot.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.springboot.Dto.OrderDto;
import com.springboot.events.OrderPlacedEvent;
import com.springboot.models.Orders;

@Service
public class OrderConsumer {

    // @Autowired
    // private ApplicationEventPublisher applicationEventPublisher;
    
    @KafkaListener(
        topics = "order-created",
        groupId = "order-group"
    )
    public void consume(OrderDto order) {

        System.out.println("Received order: " + order.getMessage());

        // List<Orders> orders = event.getOrders();

        // for(Orders order: orders){
        //     System.out.println("Received order: " + order.getId());
        // }

        // // send email here
        // applicationEventPublisher.publishEvent(event);
    }

}
