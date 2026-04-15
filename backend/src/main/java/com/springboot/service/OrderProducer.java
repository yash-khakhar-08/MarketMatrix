package com.springboot.service;

import java.util.List;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.springboot.Dto.OrderDto;
import com.springboot.events.OrderPlacedEvent;
import com.springboot.models.Orders;

@Service
public class OrderProducer {
    
    private final KafkaTemplate<String, OrderDto> kafkaTemplate;

    public OrderProducer(KafkaTemplate<String, OrderDto> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendOrder(OrderDto order) {

        //OrderPlacedEvent event = new OrderPlacedEvent(orderList);

        //kafkaTemplate.send("order-created", event);

        kafkaTemplate.send("order-created", order).whenComplete((result, ex) -> {
            if (ex == null) {
                System.out.println("Sent message with offset: " + result.getRecordMetadata().offset());
            } else {
                System.err.println("Unable to send message: " + ex.getMessage());
            }
        });

        System.out.println("Order sent to Kafka");

    }

}
