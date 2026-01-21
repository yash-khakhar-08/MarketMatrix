package com.springboot.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.springboot.Dto.CartDto;
import com.springboot.Dto.LoginRequestDto;
import com.springboot.Dto.LoginResponseDto;
import com.springboot.Dto.UserDto;
import com.springboot.models.User;
import com.springboot.repository.UserRepo;

@Service
public class AuthService {  

    @Autowired
    private UserRepo userRepo;
    
    @Autowired
    private AuthenticationManager authManager;
    
    @Autowired
    private JwtService jwtService;

    @Autowired
    private CartInfoService cartInfoService;

    public LoginResponseDto login(LoginRequestDto loginRequestDto){
        
        Authentication auth =  authManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequestDto.getEmail(),
                loginRequestDto.getPassword()
            ));

        LoginResponseDto loginResponseDto = new LoginResponseDto();
        UserDto userDto = new UserDto();
        
        if(auth.isAuthenticated()){
            
            String token = jwtService.generateToken(loginRequestDto.getEmail());
            loginResponseDto.setToken(token);
            
            User user = userRepo.findByEmail(loginRequestDto.getEmail());

            if(user.getStatus().equals("delete")){
                throw new RuntimeException("Account does not exists");
            }

            user.setJwtToken(token);
            
            if(user.getAddress() != null) {
                String address = user.getAddress().getBlockNo() + ", " + user.getAddress().getApartmentName() + ", " + user.getAddress().getCity()
                    + ", " + user.getAddress().getState() + ", " + user.getAddress().getPinCode() + ", " + user.getAddress().getCountry();
                
                userDto.setAddress(address);
                
            }
            
            userDto.setId(user.getId());
            userDto.setFullName(user.getFullName());
            userDto.setEmail(user.getEmail());
            userDto.setRole(user.getRole());
            userDto.setGender(user.getGender());
            userDto.setMobileNo(user.getMobileNo());
            userDto.setStatus(user.getStatus());
            
            loginResponseDto.setUserDto(userDto);
            
            // saving jwt token to user table
            userRepo.save(user);

            // fetching cart details
            List<CartDto> cartList = cartInfoService.getUserCart(user.getId());
            loginResponseDto.setCartList(cartList);

            return loginResponseDto;
            
        }
        
        return null;
        
    }
    

    public boolean register(UserDto userDto){
        
        userDto.setRole("ROLE_USER");
        
        userDto.setPassword(
            new BCryptPasswordEncoder().encode(userDto.getPassword())
        );
        
        User user = userRepo.findByEmail(userDto.getEmail());

        if(user != null){
            throw new RuntimeException("This email is already registered!!");
        }

        User newUser = User.builder()
            .email(userDto.getEmail())
            .fullName(userDto.getFullName())
            .gender(userDto.getGender())
            .mobileNo(userDto.getMobileNo())
            .password(userDto.getPassword())
            .role(userDto.getRole())
            .build();

        userRepo.save(newUser);

        return true;
        
    }
}
