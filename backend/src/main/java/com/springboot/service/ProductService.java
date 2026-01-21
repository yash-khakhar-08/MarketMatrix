package com.springboot.service;

import com.springboot.Dto.CategoryDto;
import com.springboot.Dto.ProductDto;
import com.springboot.JsonResponse.CategoryResponse;
import com.springboot.JsonResponse.ProductResponse;
import com.springboot.models.CartInfo;
import com.springboot.models.Category;
import com.springboot.models.Product;
import com.springboot.models.User;
import com.springboot.repository.CartInfoRepo;
import com.springboot.repository.ProductRepo;
import com.springboot.repository.UserRepo;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepo productRepo;
    
    @Autowired
    private CartInfoRepo cartInfoRepo;
    
    @Autowired
    private UserRepo userRepo;
    
    public Product addProduct(Product p){
        
        return productRepo.save(p);
        
    }

    public void updateProduct(ProductDto productDto){
        
        Product p = productRepo.findById(productDto.id).get();
        if(p == null){
            throw new RuntimeException("Product Id is missing");
        }

        p.setProductName(productDto.productName);
        p.setProductDesc(productDto.productDesc);
        p.setProductPrice(productDto.productPrice);
        p.setProductQty(productDto.productQty);
        p.setProductImage(productDto.productImage);

        productRepo.save(p);
        
    }
    
    public Product getById(Integer id){
        return productRepo.findById(id).get();
    }
    
    public Product updateProduct(Product product){
        return productRepo.save(product);
    }
    
    public List<CategoryResponse> getSearchProducts(String query, Integer minPrice, Integer maxPrice, Integer userId){
        
        Integer categoryId = productRepo.getFirstProductCategory(query, minPrice, maxPrice);
        
        List<Product> products = productRepo.getSearchProducts(query, minPrice, maxPrice, categoryId);
        
        if(products != null && !ObjectUtils.isEmpty(products)) {
            
            List<CategoryResponse> catRes = new LinkedList<>();
        
            for(Product product : products){

                List<ProductResponse> productResponse = new LinkedList<>();
                Boolean inCart = false;
                
                if(userId != null){
                    User user = userRepo.findById(userId).get();
                    
                    CartInfo cart = cartInfoRepo.findByProductAndUser(product, user);
                    
                    if(cart != null && !ObjectUtils.isEmpty(cart)) {
                        inCart = true;
                    }
                    
                }
                
                productResponse.add(
                        ProductResponse.builder()
                                .id(product.getId())
                                .productName(product.getProductName())
                                .productDesc(product.getProductDesc())
                                .productPrice(product.getProductPrice())
                                .productQty(product.getProductQty())
                                .productImage(product.getProductImage())
                                .inCart(inCart)
                                .build()
                );

                catRes.add(
                        CategoryResponse.builder()
                        .id(product.getCategory().getId())
                        .catName(product.getCategory().getCatName())
                        .sectionName(product.getCategory().getSectionName())
                        .productResponse(productResponse)
                        .build()
                );

            }

            return catRes;
            
        }
        
        return null;
        
    }
    
    public List<Product> getByCategory(Category category){
        
        List<Product> products = productRepo.findByCategory(category);
        
        Collections.shuffle(products); // Shuffle list randomly
        
        return products.stream().limit(4).collect(Collectors.toList());
        
    }
    
    public List<ProductResponse> getAllProducts(List<Product> products){
        
        List<ProductResponse> productResponse = new ArrayList<>();
        
        for(Product p : products){
            
            productResponse.add(
                ProductResponse.builder()
                .id(p.getId())
                .productName(p.getProductName())
                .productDesc(p.getProductDesc())
                .productImage(p.getProductImage())
                .productPrice(p.getProductPrice())
                .productQty(p.getProductQty())
                .status(p.getStatus())
                .build()
            );
            
            
        }
        
        return productResponse;
        
        
    }

    public List<ProductDto> fetchAllProducts(){
        
        List<ProductDto> productList = new ArrayList<>();

        List<Product> products = productRepo.findAll();
        
        for(Product p : products){

            CategoryDto categoryDto = new CategoryDto();
            categoryDto.id = p.getCategory().getId();
            categoryDto.catName = p.getCategory().getCatName();
            categoryDto.sectionName = p.getCategory().getSectionName();

            productList.add(

                ProductDto.builder()
                .id(p.getId())
                .productName(p.getProductName())
                .productDesc(p.getProductDesc())
                .productImage(p.getProductImage())
                .productPrice(p.getProductPrice())
                .productQty(p.getProductQty())
                .status(p.getStatus())
                .category(categoryDto)
                .build()

            );
            
        }
        
        return productList;
        
    }

    public void deleteProduct(Integer productId){

        Product product = productRepo.findById(productId).get();

        if(ObjectUtils.isEmpty(product)){
            throw new RuntimeException("Product Id is missing!");
        }

        product.setStatus("delete");

        productRepo.save(product);

    }

    public List<ProductDto> filterAllProducts(String searchTerm){
        
        List<ProductDto> productList = new ArrayList<>();

        List<Product> products = productRepo.findByProductNameOrProductDesc("%"+searchTerm+"%");
        
        for(Product p : products){

            CategoryDto categoryDto = new CategoryDto();
            categoryDto.id = p.getCategory().getId();
            categoryDto.catName = p.getCategory().getCatName();
            categoryDto.sectionName = p.getCategory().getSectionName();

            productList.add(

                ProductDto.builder()
                .id(p.getId())
                .productName(p.getProductName())
                .productDesc(p.getProductDesc())
                .productImage(p.getProductImage())
                .productPrice(p.getProductPrice())
                .productQty(p.getProductQty())
                .status(p.getStatus())
                .category(categoryDto)
                .build()

            );
            
        }
        
        return productList;
        
    }
  
}
