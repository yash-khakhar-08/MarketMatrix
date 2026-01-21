package com.springboot.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.springboot.Dto.ProductDto;
import com.springboot.Dto.ResponseMessageDto;
import com.springboot.Dto.UserDto;
import com.springboot.JsonResponse.CategoryResponse;
import com.springboot.JsonResponse.OrderResponse;
import com.springboot.models.Category;
import com.springboot.models.Product;
import com.springboot.service.CategoryService;
import com.springboot.service.OrdersService;
import com.springboot.service.ProductService;
import com.springboot.service.UserService;


@RestController
@RequestMapping("/admin/")
public class AdminController {
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private CategoryService categoryService;

    @Autowired
    private UserService userService;

    @Autowired
    private OrdersService ordersService;
    
    @GetMapping("/getCategory")
    public ResponseEntity<?> getCategory(){
        
        List<CategoryResponse> category =  categoryService.getAllCategory();
        
        if(ObjectUtils.isEmpty(category)){
            
            return new ResponseEntity<>("Something went wrong",HttpStatus.INTERNAL_SERVER_ERROR);
            
        } 
        
        return new ResponseEntity<>(category,HttpStatus.OK);
        
    }
    
    @PostMapping("/addCategory")
    public ResponseEntity<?> addCategory(@RequestBody Category category){
        
        ResponseMessageDto response = new ResponseMessageDto();

        try{

            categoryService.addCategory(category);

            response.setMessage("Category added");
            
            return new ResponseEntity<>(response, HttpStatus.OK);
            
        } catch(Exception e){

            response.setMessage(e.getMessage());

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);

        }   
    }

    @DeleteMapping("/deleteCategory")
    public ResponseEntity<?> deleteCategory(@RequestBody Map<String,Integer> data){
        
        ResponseMessageDto response = new ResponseMessageDto();

        try{

            categoryService.deleteCategory(data.get("categoryId"));

            response.setMessage("Category Deleted!!");
        
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch(Exception e){

            response.setMessage(e.getMessage());

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);

        }
        
    }
    
    @PostMapping("/addProduct")
    public ResponseEntity<?> addProduct(@RequestPart("product") String productJson, @RequestPart("selectedCategory") String selectedCategory, 
                                    @RequestPart("image") MultipartFile file){
        
        try{
            
            ObjectMapper objectMapper = new ObjectMapper();
            Product product = objectMapper.readValue(productJson, Product.class);
            CategoryResponse category = objectMapper.readValue(selectedCategory, CategoryResponse.class);
            product.setCategory(Category.builder().id(category.getId()).catName(category.getCatName()).sectionName(category.getSectionName()).build());
            
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

            Path uploadPath = Paths.get("uploads/products");
            Files.createDirectories(uploadPath);

            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            product.setProductImage(fileName);
            productService.addProduct(product);

            return ResponseEntity.ok(product);
                
        }catch(IOException e){
            System.out.println("Error: " + e.getMessage());
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
    }
    

    @GetMapping("/getAllProducts")
    public ResponseEntity<?> getAllProducts(){
        
        try{

            List<ProductDto> productList =  productService.fetchAllProducts();

            Map<String, List<ProductDto>> response = new HashMap<>();
            response.put("products", productList);
        
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch(Exception e){

            ResponseMessageDto response = new ResponseMessageDto();
            response.setMessage(e.getMessage());

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);

        }
        
    }

    @DeleteMapping("/deleteProduct")
    public ResponseEntity<?> deleteProduct(@RequestBody Map<String,Integer> data){
        
        ResponseMessageDto response = new ResponseMessageDto();

        try{

            productService.deleteProduct(data.get("productId"));

            response.setMessage("Product Deleted!!");
        
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch(Exception e){

            response.setMessage(e.getMessage());

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);

        }
        
    }

    @PutMapping(
        value = "/updateProduct",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> updateProduct(
        @RequestPart("product") ProductDto productDto,
        @RequestPart(value = "image", required = false) MultipartFile file
    ) {
        
        ResponseMessageDto response = new ResponseMessageDto();                                
        
        try{
            
            if(file != null) {

                String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

                Path uploadPath = Paths.get("uploads/products");
                Files.createDirectories(uploadPath);

                Path filePath = uploadPath.resolve(fileName);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                productDto.setProductImage(fileName);

            }
        
            productService.updateProduct(productDto);

            response.setMessage("Product Updated!!");

            return new ResponseEntity<>(response, HttpStatus.OK);
                
        }catch(IOException e){

            response.setMessage(e.getMessage());

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);

        }
        
    }

    @GetMapping("/getAllCustomers")
    public ResponseEntity<?> getAllCustomers(){
        
        try{

            List<UserDto> userList =  userService.getAllUsers();

            Map<String, List<UserDto>> response = new HashMap<>();
            response.put("customers", userList);
        
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch(Exception e){

            ResponseMessageDto response = new ResponseMessageDto();
            response.setMessage(e.getMessage());

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);

        }   
    }

    @DeleteMapping("/deleteCustomer")
    public ResponseEntity<?> deleteCustomer(@RequestBody Map<String,Integer> data){
        
        ResponseMessageDto response = new ResponseMessageDto();

        try{

            userService.deleteUser(data.get("customerId"));

            response.setMessage("User Deleted!!");
        
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch(Exception e){

            response.setMessage(e.getMessage());

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);

        }
        
    }

    @PutMapping("/updateCustomer")
    public ResponseEntity<?> updateCustomer(@RequestBody UserDto userDto){
        
        ResponseMessageDto response = new ResponseMessageDto();

        try{

            userService.updateUserData(userDto);

            response.setMessage("User Updated!!");
        
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch(Exception e){

            response.setMessage(e.getMessage());

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);

        }   
    }

    @GetMapping("/getAllOrders")
    public ResponseEntity<?> getAllOrders(){
        
        try{

            List<OrderResponse> orderList =  ordersService.getAllOrders();

            Map<String, List<OrderResponse>> response = new HashMap<>();
            response.put("orders", orderList);
        
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch(Exception e){

            ResponseMessageDto response = new ResponseMessageDto();
            response.setMessage(e.getMessage());

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);

        }
        
    }

    @PutMapping("/updateOrderStatus")
    public ResponseEntity<?> updateOrderStatus(@RequestBody Map<String, String> payload){
        
        ResponseMessageDto response = new ResponseMessageDto();

        try{

            ordersService.updateOrderStatus(
                payload.get("orderId"), 
                payload.get("status")
            );

            response.setMessage("Order status changed");
        
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch(Exception e){

            response.setMessage(e.getMessage());

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);

        }
        
    }

}
