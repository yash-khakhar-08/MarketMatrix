package com.springboot.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class User {
    
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    
    private String fullName;
    
    private String email;
    
    private String password;
    
    private String role;
    
    private String gender;
    
    private String mobileNo;
    
    private int otpCode;
    
    private String jwtToken;

    @Builder.Default
    @Column(nullable = false, columnDefinition = "varchar(20) default 'pending'")
    private String status = "pending";
    
    @OneToOne
    private Address address;
    
    @OneToMany(mappedBy = "user")
    private List<CartInfo> cartInfo;
    
    @OneToMany(mappedBy = "user")
    private List<Orders> orders;
    
    @Override
    public String toString() {
        return "User{" + "id=" + id + ", fullName=" + fullName + ", email=" + email + ", password=" + password + ", role=" + role + ", gender=" + gender + ", mobileNo=" + mobileNo  + "\nAddress: " + address + '}';
    }
    
}
