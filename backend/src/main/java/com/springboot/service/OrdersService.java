package com.springboot.service;

import com.springboot.Dto.OrderDto;
import com.springboot.JsonResponse.OrderResponse;
import com.springboot.JsonResponse.ProductResponse;
import com.springboot.events.OrderCancelEvent;
import com.springboot.events.OrderDeliveredEvent;
import com.springboot.events.OrderPlacedEvent;
import com.springboot.models.CartInfo;
import com.springboot.models.Orders;
import com.springboot.models.Product;
import com.springboot.models.User;
import com.springboot.repository.OrdersRepo;
import com.springboot.repository.ProductRepo;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;

@Service
public class OrdersService {
    
    @Autowired
    private OrdersRepo ordersRepo;
    
    @Autowired
    private ProductRepo productRepo;
    
    @Autowired
    private CartInfoService cartInfoService;
    
    @Autowired
    private UserService userService;

    @Autowired
    private ApplicationEventPublisher applicationEventPublisher;

    private final OrderProducer producer;

    public OrdersService(OrderProducer producer){
        this.producer = producer;
    }
    
    @Transactional
    public boolean saveOrder(int userId, String paymentMode){
        
        List<CartInfo> cartInfo = cartInfoService.getByUser(userId);

        List<Orders> orderList = new ArrayList<>();

        if (ObjectUtils.isEmpty(cartInfo)) return false;

        for(CartInfo cart: cartInfo){

            if (cart.getProduct().getProductQty() < cart.getPurchaseQty()) {
                throw new RuntimeException("Insufficient stock");
            }

            Orders orders = new Orders();
            orders.setPaymentMode(paymentMode);
            orders.setProduct(cart.getProduct());
            orders.setPurchaseAmt(cart.getPurchaseAmt());
            orders.setPurchaseQty(cart.getPurchaseQty());
            orders.setStatus("Pending");
            orders.setUser(cart.getUser());

            //ordersRepo.save(orders);
            producer.sendOrder(new OrderDto("Order placed by: " + orders.getUser().getFullName()));

            orderList.add(orders);
                        
            Product product = cart.getProduct();
            product.setProductQty( product.getProductQty() - cart.getPurchaseQty());
            productRepo.save(product);
                        
            cartInfoService.removeFromCart(cart.getId());
            
        }

        //applicationEventPublisher.publishEvent(new OrderPlacedEvent(orderList));

        return true;
        
    }
    
    public List<OrderResponse> getOrders(int userId){
        
        User user = userService.getUserById(userId);
        
        List<Orders> orders = ordersRepo.findByUserOrderByDateDesc(user);
        
        List<OrderResponse> orderResponse = new LinkedList<>();
        
        if(orders != null && !ObjectUtils.isEmpty(user)){
            
            for(Orders order : orders){
                
                orderResponse.add( OrderResponse.builder()
                        .id(order.getId()) 
                        .date(order.getDate())
                        .product( ProductResponse.builder()
                                .id(order.getProduct().getId())   
                                .productName(order.getProduct().getProductName())
                                .productDesc(order.getProduct().getProductDesc())
                                .productPrice(order.getProduct().getProductPrice())
                                .productQty(order.getProduct().getProductQty())
                                .productImage(order.getProduct().getProductImage())
                                .build()
                        )
                        .purchaseQty(order.getPurchaseQty())
                        .purchaseAmt(order.getPurchaseAmt())
                        .status(order.getStatus())
                        .paymentMode(order.getPaymentMode())
                        .build()
                );
                
            }
            
            return orderResponse;
            
        }
        
        return null;
        
    }
    
    @Transactional
    public boolean cancelOrder(int orderId){
        
        try{
            
            Orders order = ordersRepo.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
            
            if(!ObjectUtils.isEmpty(order)){

                order.setStatus("Canceled");
                ordersRepo.save(order);

                Product product = order.getProduct();
                product.setProductQty(product.getProductQty() + order.getPurchaseQty());
                productRepo.save(product);

                applicationEventPublisher.publishEvent(new OrderCancelEvent(order));
                
                return true;
            }
            
        } catch(Exception e){
            System.out.println(e);
        }
        
        return false;
        
    }
    
    public List<OrderResponse> getAllOrders(){
        
        List<Orders> orders = ordersRepo.findAllByOrderByDateDesc();
        
        List<OrderResponse> orderResponse = new LinkedList<>();
        
        if(orders.size() != 0){
            
            for(Orders order : orders){
                
                orderResponse.add( OrderResponse.builder()
                        .id(order.getId()) 
                        .date(order.getDate())
                        .product( ProductResponse.builder()
                                .id(order.getProduct().getId())   
                                .productName(order.getProduct().getProductName())
                                .productDesc(order.getProduct().getProductDesc())
                                .productPrice(order.getProduct().getProductPrice())
                                .productQty(order.getProduct().getProductQty())
                                .productImage(order.getProduct().getProductImage())
                                .build()
                        )
                        .purchaseQty(order.getPurchaseQty())
                        .purchaseAmt(order.getPurchaseAmt())
                        .status(order.getStatus())
                        .paymentMode(order.getPaymentMode())
                        .userId(order.getUser().getId())
                        .build()
                );
                
            }
            
        }
        
        return orderResponse;
        
    }

    public Orders getOrderById(Integer orderId){

        Orders orders = ordersRepo.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));

        return orders;

    }

    @Transactional
    public void updateOrderStatus(String orderId, String status){

        Orders order = getOrderById(Integer.valueOf(orderId));

        order.setStatus(status);

        if(status.equals("Canceled")){

            Product product = order.getProduct();
            product.setProductQty(product.getProductQty() + order.getPurchaseQty());
            productRepo.save(product);

        }

        ordersRepo.save(order);

        if(status.equals("Delivered")){
            applicationEventPublisher.publishEvent(new OrderDeliveredEvent(order));
        } else if(status.equals("Canceled")){
            applicationEventPublisher.publishEvent(new OrderCancelEvent(order));
        }
        
    }

}
