package com.springboot.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.springboot.Dto.ResponseMessageDto;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.RefundCreateParams;

@RestController
@RequestMapping("/user/payments")
public class PaymentController {

    @PostMapping("/create-intent")
    public ResponseEntity<?> createPaymentIntent(@RequestBody Map<String, Object> data) {
        
        ResponseMessageDto response = new ResponseMessageDto();

        try{

            int amount = (int) data.get("amount");

            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                        .setAmount((long) amount)
                        .setCurrency("inr")
                        .addPaymentMethodType("card")
                        .build();

            PaymentIntent intent = PaymentIntent.create(params);

            response.setMessage(intent.getClientSecret());

            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch(Exception e){
            response.setMessage(e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
    }

    @PostMapping("/refund")
    public ResponseEntity<?> refund(@RequestBody Map<String, String> data) {

        ResponseMessageDto response = new ResponseMessageDto();

        try{

            String paymentIntentId = data.get("paymentIntentId");

            RefundCreateParams params = RefundCreateParams.builder()
                    .setPaymentIntent(paymentIntentId)
                    .build();

            Refund.create(params);

            response.setMessage("Refund Intiated");

            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch(Exception e){
            response.setMessage(e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }


}   
