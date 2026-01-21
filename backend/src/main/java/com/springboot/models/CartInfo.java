/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.springboot.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import java.util.Date;
import org.hibernate.annotations.CreationTimestamp;

/**
 *
 * @author Yash
 */

@Entity
public class CartInfo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    
    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    private Date date;
    
    @ManyToOne
    private User user;
    
    @ManyToOne
    private Product product;
    
    private int purchaseQty;
    
    private long purchaseAmt;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public int getPurchaseQty() {
        return purchaseQty;
    }

    public void setPurchaseQty(int purchaseQty) {
        this.purchaseQty = purchaseQty;
    }

    public long getPurchaseAmt() {
        return purchaseAmt;
    }

    public void setPurchaseAmt(long purchaseAmt) {
        this.purchaseAmt = purchaseAmt;
    }
    
    
}
