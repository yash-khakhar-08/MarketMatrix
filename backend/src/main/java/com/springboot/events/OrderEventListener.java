package com.springboot.events;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.springboot.models.Orders;
import com.springboot.service.EmailService;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OrderEventListener {

    @Autowired
    private EmailService emailService;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleOrderPlaced(OrderPlacedEvent event) throws MessagingException {

        List<Orders> orders = event.getOrders();

        emailService.sendOrderSummaryEmail(orders);
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleOrderCancellation(OrderCancelEvent event) throws MessagingException {

        Orders order = event.getOrder();

        emailService.sendOrderCancellationEmail(order);
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleOrderDelivered(OrderDeliveredEvent event) throws MessagingException {

        Orders order = event.getOrder();

        emailService.sendOrderDeliveredEmail(order);
    }

}
