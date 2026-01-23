package com.springboot.service;

import com.springboot.models.Address;
import com.springboot.repository.AddressRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AddressService {
    
    @Autowired
    private AddressRepo addressRepo;
    
    public Address saveAddress(Address address){
        return addressRepo.save(address);
    }
    
}
