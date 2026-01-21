package com.springboot.Dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartDto {
    
    public Integer id;
     
    public Date date;
     
    public Integer purchaseQty;
    
    public Long purchaseAmt;
    
    public Integer userId;
    
    public Integer categoryId;
    
    public ProductDto product;

}
