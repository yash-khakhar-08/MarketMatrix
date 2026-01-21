package com.springboot.JsonResponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ProductResponse {
    
    private int id;
    
    private String productName;
   
    private String productDesc;
    
    private int productPrice;
    
    private int productQty;
    
    private String productImage;

    private String status;
    
    private Boolean inCart;
    
}
