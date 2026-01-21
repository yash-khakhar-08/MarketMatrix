package com.springboot.repository;

import com.springboot.models.Category;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepo extends JpaRepository<Category, Integer>  {
    
    public List<Category> findBySectionName(String section);
    
    public List<Category> findBySectionNameStartingWith(String sectionName);

    public Category findByCatNameAndSectionName(String catName, String sectionName);
    
}
