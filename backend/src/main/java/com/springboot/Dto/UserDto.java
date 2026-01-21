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
public class UserDto {

    public Integer id;
    
    public String fullName;
    
    public String email;
    
    public String role;
    
    public String gender;
    
    public String mobileNo;
    
    public String address;

    public String password;

    public String status;

}
