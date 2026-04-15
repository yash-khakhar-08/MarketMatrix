package com.springboot.repository;

import com.springboot.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<User, Integer> {
    
    public User findByEmail(String username);

    public User findByJwtToken(String jwtToken);
    
}
