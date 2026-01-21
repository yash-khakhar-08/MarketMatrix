package com.springboot.service;

import com.springboot.JsonResponse.CategoryResponse;
import com.springboot.models.Category;
import com.springboot.models.Product;
import com.springboot.repository.CategoryRepo;
import com.springboot.repository.ProductRepo;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

@Service
public class CategoryService {
    
    @Autowired
    private CategoryRepo categoryRepo;
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private ProductRepo productRepo;
    
    public List<CategoryResponse> getAllCategoryWithRandomProducts(String sectionName){
        
        List<Category> categories = sectionName != null? categoryRepo.findBySectionNameStartingWith(sectionName) : categoryRepo.findAll() ;
        
        List<CategoryResponse> catRes = new ArrayList<>();

        for (Category category : categories) {
            List<Product> products = productRepo.getRandomProducts(category.getId());
            
            if(!ObjectUtils.isEmpty(products)){ 
                
                 catRes.add( CategoryResponse.builder().id(category.getId()).catName(category.getCatName())
                    .sectionName(category.getSectionName()).productResponse(productService.getAllProducts(products)).build());
            }
            
            
        }
        
        return catRes;
        
    }
    
    public CategoryResponse getRelatedProductsByCategoryId(int id, int productId){
        
        Category category = categoryRepo.findById(id).get();

        if(!ObjectUtils.isEmpty(category)){
            
            List<Product> products = productRepo.getRandomProducts(category.getId());
            products.removeIf(product -> product.getId() == productId);
            
            if(!ObjectUtils.isEmpty(products)) {
                return CategoryResponse.builder().id(category.getId()).catName(category.getCatName())
                .sectionName(category.getSectionName()).productResponse(productService.getAllProducts(products)).build();
            }
            
            
        }
        
        return null;
        
    }
    
    public List<CategoryResponse> getCategoryIfProduct(){
        
        List<Category> categories = categoryRepo.findAll();
        
        List<CategoryResponse> catRes = new ArrayList<>();
        
        for (Category category : categories) {
            
            if(!ObjectUtils.isEmpty(category.getProduct())){
                
                catRes.add( CategoryResponse.builder().id(category.getId()).catName(category.getCatName())
                    .sectionName(category.getSectionName()).build());
            }
            
            
        }
        
        return catRes;  
        
    }
    
     public List<CategoryResponse> getAllCategory(){
        
        List<Category> categories = categoryRepo.findAll();
        
        List<CategoryResponse> catRes = new ArrayList<>();
        
        for (Category category : categories) {
            
             catRes.add( CategoryResponse.builder().id(category.getId()).catName(category.getCatName())
                    .sectionName(category.getSectionName()).build());
            
        }
        
        return catRes;  
        
    }

    public void addCategory(Category category){

        Category isCategoryexists = categoryRepo.findByCatNameAndSectionName(
            category.getCatName(), 
            category.getSectionName()
        );

        if(isCategoryexists != null){
            throw new RuntimeException("Category already exists");
        }

        categoryRepo.save(category);

    }

    public void deleteCategory(Integer categoryId){

        Category category = categoryRepo.findById(categoryId).get();

        if(ObjectUtils.isEmpty(category) || category == null){
            throw new RuntimeException("Category Id is not present");
        }

        if(!ObjectUtils.isEmpty(category.getProduct())){
            throw new RuntimeException("Category cannot be deleted because there are products attached to it.");
        }

        categoryRepo.delete(category);

    }
    
}
