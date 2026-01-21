package com.springboot.JsonResponse;

import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UserResponse {
    
    @Nullable
    private Integer id;
    
    private String fullName;
    
    private String email;
    
    private String password;
    
    private String role;
    
    private String gender;
    
    private String mobileNo;
    
    private String address;
    
    private String jwtToken;

    private String status;
    
}
