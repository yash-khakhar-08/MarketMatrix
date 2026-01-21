package com.springboot.JsonResponse;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CartResponse {
    
    private Integer id;
     
    private Date date;
     
    private Integer purchaseQty;
    
    private Long purchaseAmt;
    
    private Integer userId;
    
    private Integer categoryId;
    
    private Integer productId;
    
    private ProductResponse product;
    
}
