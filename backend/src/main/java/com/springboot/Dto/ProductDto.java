package com.springboot.Dto;

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
public class ProductDto {
    
    public Integer id;
    
    public String productName;
   
    public String productDesc;
    
    public Integer productPrice;
    
    public Integer productQty;
    
    public String productImage;

    public String status;

    public CategoryDto category;

}
