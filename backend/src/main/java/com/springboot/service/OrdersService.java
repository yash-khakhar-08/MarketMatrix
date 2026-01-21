package com.springboot.service;

import com.springboot.JsonResponse.OrderResponse;
import com.springboot.JsonResponse.ProductResponse;
import com.springboot.models.CartInfo;
import com.springboot.models.Orders;
import com.springboot.models.Product;
import com.springboot.models.User;
import com.springboot.repository.OrdersRepo;
import com.springboot.repository.ProductRepo;
import java.util.LinkedList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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
    
    public boolean saveOrder(int userId, String paymentMode){
        
        try{
            
            List<CartInfo> cartInfo = cartInfoService.getByUser(userId);
            if(cartInfo != null && !ObjectUtils.isEmpty(cartInfo)){

                for(CartInfo cart: cartInfo){

                    Orders orders = new Orders();
                    orders.setPaymentMode(paymentMode);
                    orders.setProduct(cart.getProduct());
                    orders.setPurchaseAmt(cart.getPurchaseAmt());
                    orders.setPurchaseQty(cart.getPurchaseQty());
                    orders.setStatus("Pending");
                    orders.setUser(cart.getUser());

                    ordersRepo.save(orders);
                    
                    Product product = cart.getProduct();
                    product.setProductQty( product.getProductQty() - cart.getPurchaseQty() );
                    productRepo.save(product);
                    
                    cartInfoService.removeFromCart(cart.getId());
                    

                }

                return true;

            }
            
        } catch(Exception e){
            System.out.println(e);
        }
        
        return false;
        
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
    
    public boolean cancelOrder(int orderId){
        
        try{
            
            Orders orders = ordersRepo.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
            
            if(orders != null && !ObjectUtils.isEmpty(orders)){
                orders.setStatus("Canceled");
                ordersRepo.save(orders);

                Product product = orders.getProduct();
                product.setProductQty(product.getProductQty() +orders.getPurchaseQty() );
                productRepo.save(product);
                
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

    public void updateOrderStatus(String orderId, String status){

        Orders orders = getOrderById(Integer.valueOf(orderId));

        orders.setStatus(status);

        ordersRepo.save(orders);

    }

}
