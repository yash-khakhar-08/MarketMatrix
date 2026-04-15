package com.springboot.Dto;

public class OrderDto {
    private String message;

    public OrderDto(){

    }

    public OrderDto(String message){
        this.message = message;
    }

    public String getMessage(){
        return message;
    }

}
