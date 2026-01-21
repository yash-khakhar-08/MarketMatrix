package com.springboot.repository;

import com.springboot.models.Orders;
import com.springboot.models.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrdersRepo extends JpaRepository<Orders, Integer> {
    
    public List<Orders> findByUserOrderByDateDesc(User user);

    List<Orders> findAllByOrderByDateDesc();
    
}
