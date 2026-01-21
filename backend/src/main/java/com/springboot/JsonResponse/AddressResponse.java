package com.springboot.JsonResponse;

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
public class AddressResponse {
    
    private Integer id;
    
    private Integer userId;
    
    private String blockNo;
    
    private String apartmentName;
    
    private String city;
    
    private Integer pinCode;
    
    private String state;
    
    private String country;
    
}
