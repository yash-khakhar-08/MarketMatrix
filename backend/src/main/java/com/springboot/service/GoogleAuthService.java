package com.springboot.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.springboot.Dto.CartDto;
import com.springboot.Dto.LoginResponseDto;
import com.springboot.Dto.UserDto;
import com.springboot.models.Address;
import com.springboot.models.User;
import com.springboot.repository.UserRepo;

@Service
public class GoogleAuthService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private CartInfoService cartInfoService;

    public void register(String email, String name){

        User user = userRepo.findByEmail(email);

        if(user != null){
            throw new RuntimeException("This email is already registered!!");
        }
        
        User newUser = User.builder()
            .email(email)
            .fullName(name)
            .gender(null)
            .mobileNo(null)
            .password(
                new BCryptPasswordEncoder().encode(UUID.randomUUID().toString())
            )
            .role("ROLE_USER")
            .status("active")
            .otpCode(0)
            .build();

        userRepo.save(newUser);

    }

    public String login(String email, String name){

        User user = userRepo.findByEmail(email);

        if(user == null){
            register(email, name);
        }

        if(user.getStatus().equals("delete")){
            throw new RuntimeException("Account does not exists");
        }

        String token = jwtService.generateToken(email);

        user.setJwtToken(token);

        userRepo.save(user);

        return token;

    }

    public LoginResponseDto getLoginData(String token){

        User user = userRepo.findByJwtToken(token);

        if(user == null){
            throw new RuntimeException("Account does not exists");
        }

        LoginResponseDto loginResponseDto = new LoginResponseDto();
        UserDto userDto = new UserDto();

        loginResponseDto.setToken(user.getJwtToken());

        if(user.getAddress() != null) {

            Address addressObj = user.getAddress();

            String address = addressObj.getBlockNo() + ", " + addressObj.getApartmentName() + ", " + addressObj.getCity()
                + ", " + addressObj.getState() + ", " + addressObj.getPinCode() + ", " + addressObj.getCountry();
                
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

        List<CartDto> cartList = cartInfoService.getUserCart(user.getId());
        loginResponseDto.setCartList(cartList);

        return loginResponseDto;

    }

}