package com.springboot.service;

import java.security.SecureRandom;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
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

import jakarta.mail.MessagingException;

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

    @Autowired
    private EmailService emailService;

    public LoginResponseDto login(LoginRequestDto loginRequestDto) throws MessagingException{
        
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

            if(user.getStatus().equals("pending")){

                SecureRandom secureRandom = new SecureRandom();
                int otpCode = 100000 + secureRandom.nextInt(900000);
                
                user.setOtpCode(otpCode);
                userRepo.save(user);

                emailService.sendAccountVerificationEmail(user.getEmail(), otpCode);

                throw new RuntimeException("Account Verification is pending");
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
            
            userRepo.save(user);

            List<CartDto> cartList = cartInfoService.getUserCart(user.getId());
            loginResponseDto.setCartList(cartList);

            return loginResponseDto;
            
        }
        
        return null;
        
    }
    

    public boolean register(UserDto userDto) throws MessagingException{
        
        userDto.setRole("ROLE_USER");
        
        userDto.setPassword(
            new BCryptPasswordEncoder().encode(userDto.getPassword())
        );
        
        User user = userRepo.findByEmail(userDto.getEmail());

        if(user != null){
            throw new RuntimeException("This email is already registered!!");
        }

        SecureRandom secureRandom = new SecureRandom();
        int otpCode = 100000 + secureRandom.nextInt(900000);

        User newUser = User.builder()
            .email(userDto.getEmail())
            .fullName(userDto.getFullName())
            .gender(userDto.getGender())
            .mobileNo(userDto.getMobileNo())
            .password(userDto.getPassword())
            .role(userDto.getRole())
            .status("pending")
            .otpCode(otpCode)
            .build();

        userRepo.save(newUser);

        emailService.sendAccountVerificationEmail(userDto.getEmail(), otpCode);

        return true;
        
    }

    public User isEmailExists(String email){
        
        User user = userRepo.findByEmail(email);

        return user;

    }

    @Async
    public void generateOtpCode(String email, User user, String subject){

        SecureRandom secureRandom = new SecureRandom();

        int otpCode = 100000 + secureRandom.nextInt(900000);

        user.setOtpCode(otpCode);
        userRepo.save(user);

        emailService.sendOtpCodeEmail(email, otpCode, subject);

    }

    public void verifyOtpCode(String email, int otpCode){

        User user = userRepo.findByEmail(email);

        if(user == null){
            throw new RuntimeException("Email does not exists.");
        }

        if(user.getOtpCode() != otpCode){
            throw new RuntimeException("Invalid Otp");
        }

    }

    public void updatePassword(String email, int otpCode, String password){

        User user = userRepo.findByEmail(email);

        if(user == null){
            throw new RuntimeException("Email does not exists.");
        }

        if(user.getOtpCode() != otpCode){
            throw new RuntimeException("Invalid Otp");
        }

        user.setPassword(new BCryptPasswordEncoder().encode(password));
        user.setOtpCode(0);
        userRepo.save(user);

    }

    public void updateAccountStatus(String email, String status){

        User user = userRepo.findByEmail(email);

        if(user == null){
            throw new RuntimeException("Email does not exists.");
        }

        user.setStatus("active");
        user.setOtpCode(0);
        userRepo.save(user);

    }

}
