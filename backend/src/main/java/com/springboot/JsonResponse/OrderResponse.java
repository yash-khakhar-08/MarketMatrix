package com.springboot.JsonResponse;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class OrderResponse {
    
    private Integer id;
    
    private Date date;
    
    private ProductResponse product;
    
    private Integer purchaseQty;
    
    private Long purchaseAmt;
    
    private String status;
    
    private String paymentMode;

    private Integer userId;
    
}
