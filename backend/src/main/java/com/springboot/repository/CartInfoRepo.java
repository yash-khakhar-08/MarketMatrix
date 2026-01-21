package com.springboot.repository;

import com.springboot.models.CartInfo;
import com.springboot.models.Product;
import com.springboot.models.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartInfoRepo extends JpaRepository<CartInfo, Integer> {
    
    public List<CartInfo> findByUser(User user);
    
    public CartInfo findByProductAndUser(Product p, User u);
    
}
