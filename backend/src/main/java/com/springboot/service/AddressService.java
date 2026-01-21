/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.springboot.service;

import com.springboot.models.Address;
import com.springboot.repository.AddressRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author Yash
 */

@Service
public class AddressService {
    
    @Autowired
    private AddressRepo addressRepo;
    
    public Address saveAddress(Address address){
        return addressRepo.save(address);
    }
    
}
