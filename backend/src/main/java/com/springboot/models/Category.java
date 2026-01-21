package com.springboot.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
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
public class Category {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    private String catName;
    
    private String sectionName;
    
    @OneToMany(mappedBy="category")
    private List<Product> product;

    @Override
    public String toString() {
        return "Category{" + "id=" + id + ", catName=" + catName + ", sectionName=" + sectionName + '}';
    }
 
}
