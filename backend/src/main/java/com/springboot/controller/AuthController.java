package com.springboot.controller;

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
import com.springboot.service.AuthService;

@RestController
@RequestMapping("/api/auth/")
public class AuthController {

    @Autowired
    private AuthService authService;

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

}
