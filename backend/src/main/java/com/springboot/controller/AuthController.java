package com.springboot.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.springboot.Dto.LoginRequestDto;
import com.springboot.Dto.LoginResponseDto;
import com.springboot.Dto.ResponseMessageDto;
import com.springboot.Dto.UserDto;
import com.springboot.models.User;
import com.springboot.service.AuthService;
import com.springboot.service.GoogleAuthService;

@RestController
@RequestMapping("/api/auth/")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private GoogleAuthService googleAuthService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequestDto){
        
         try {

            LoginResponseDto loginResponseDto = authService.login(loginRequestDto);
            
            if(loginResponseDto == null){
            
                return new ResponseEntity<>("Bad Credentials ",HttpStatus.BAD_REQUEST);
            } 
        
            return new ResponseEntity<>(loginResponseDto, HttpStatus.OK);

        } catch(Exception e){
            
            ResponseMessageDto response = new ResponseMessageDto();
            response.setMessage(e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        
        
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDto userDto){
        
        ResponseMessageDto response = new ResponseMessageDto();

         try {
        
            Boolean isUserCreated = authService.register(userDto);

            if(isUserCreated){
                response.setMessage("Account Created");
                return new ResponseEntity<>(response, HttpStatus.OK);
             }else{
                response.setMessage("Account Creation failed");
                return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
             }

        } catch(Exception e){
            
            response.setMessage(e.getMessage());
            return new ResponseEntity<>(response ,HttpStatus.INTERNAL_SERVER_ERROR);

        }
         
    }

    @PostMapping("/verifyEmail")
    public ResponseEntity<?> verifyEmail(@RequestBody Map<String, String> payload){
        
        ResponseMessageDto response = new ResponseMessageDto();

        try {

            String email = payload.get("email");

            User user = authService.isEmailExists(email);
            
            if(user == null){
                throw new RuntimeException("Email does not exists");
            }    

            authService.generateOtpCode(email, user,"MarketMatrix - Forgot Password OTP");

            response.setMessage("Email Verified");    
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch(Exception e){
            response.setMessage(e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
    }

    @PostMapping("/verifyOtpCode")
    public ResponseEntity<?> verifyOtpCode(@RequestBody Map<String, String> payload){
        
        ResponseMessageDto response = new ResponseMessageDto();

        try {

            String email = payload.get("email");

            Integer optCode = Integer.valueOf(payload.get("otp"));

            authService.verifyOtpCode(email, optCode);

            response.setMessage("Otp Verified");    
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch(Exception e){
            response.setMessage(e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
    }

    @PostMapping("/updatePassword")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> payload){
        
        ResponseMessageDto response = new ResponseMessageDto();

        try {

            String email = payload.get("email");

            Integer optCode = Integer.valueOf(payload.get("otp"));

            String password = payload.get("password");

            authService.updatePassword(email, optCode, password);

            response.setMessage("Password Updated Successfully");    
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch(Exception e){
            response.setMessage(e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }   
    }

    @PostMapping("/verifyAccount")
    public ResponseEntity<?> verifyAccount(@RequestBody Map<String, String> payload){
        
        ResponseMessageDto response = new ResponseMessageDto();

        try {

            String email = payload.get("email");

            Integer optCode = Integer.valueOf(payload.get("otp"));

            authService.verifyOtpCode(email, optCode);

            authService.updateAccountStatus(email,"active");

            response.setMessage("Account Verified successfully");    
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch(Exception e){
            response.setMessage(e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
    }

    @PostMapping("/getLoginData")
    public ResponseEntity<?> getLoginData(@RequestBody Map<String, String> payload){
        
         try {

            LoginResponseDto loginResponseDto = googleAuthService.getLoginData(payload.get("token")); 
        
            return new ResponseEntity<>(loginResponseDto, HttpStatus.OK);

        } catch(Exception e){
            
            ResponseMessageDto response = new ResponseMessageDto();
            response.setMessage(e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        
    }

}
