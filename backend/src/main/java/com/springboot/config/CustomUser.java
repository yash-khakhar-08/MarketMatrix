package com.springboot.config;

import com.springboot.models.User;
import java.util.Arrays;
import java.util.Collection;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class CustomUser implements UserDetails  {
    
    private User user;

    public CustomUser(User user) {
        System.out.println("CustomUser obj created");
        this.user = user;
    }
    
    

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(user.getRole());
        return Arrays.asList(authority);
        
    }

    @Override
    public String getPassword() {
        
        return user.getPassword();
        
    }

    @Override
    public String getUsername() {
        
        return user.getEmail();
        
    }

    public String getStatus(){
        return user.getStatus();
    }
    
}
