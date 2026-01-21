package com.springboot.service;

import com.springboot.Dto.CartDto;
import com.springboot.Dto.ProductDto;
import com.springboot.JsonResponse.CartResponse;
import com.springboot.JsonResponse.ProductResponse;
import com.springboot.models.CartInfo;
import com.springboot.models.Product;
import com.springboot.models.User;
import com.springboot.repository.CartInfoRepo;
import com.springboot.repository.UserRepo;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CartInfoService {
    
    @Autowired
    private CartInfoRepo cartInfoRepo;
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private UserRepo userRepo;
    
    public CartDto addToCart(CartResponse cartResponse){
        
        try{
            
            Product product  = productService.getById(cartResponse.getProductId());

            User user = userRepo.findById(cartResponse.getUserId()).get();

            CartInfo cartInfo = new CartInfo();
            cartInfo.setProduct(product);
            cartInfo.setPurchaseQty(cartResponse.getPurchaseQty());
            cartInfo.setPurchaseAmt(product.getProductPrice() * cartResponse.getPurchaseQty());
            cartInfo.setUser(user);

            CartInfo newCartItem = cartInfoRepo.save(cartInfo);

            ProductDto productDto = ProductDto.builder()
                .id(newCartItem.getProduct().getId())
                .productDesc(newCartItem.getProduct().getProductDesc())
                .productImage(newCartItem.getProduct().getProductImage())
                .productName(newCartItem.getProduct().getProductName())
                .productPrice(newCartItem.getProduct().getProductPrice())
                .productQty(newCartItem.getProduct().getProductQty())
                .build();

            CartDto cartDto = CartDto.builder()
                            .id(newCartItem.getId())
                            .product(productDto)
                            .date(newCartItem.getDate())
                            .purchaseAmt(newCartItem.getPurchaseAmt())
                            .purchaseQty(newCartItem.getPurchaseQty())
                            .userId(newCartItem.getUser().getId())
                            .categoryId(newCartItem.getProduct().getCategory().getId())
                            .build();
            
            return cartDto;
            
        } catch(Exception e){
            System.out.println(e);
            return null;
            
        }
       
    }
    
    public boolean updateCart(CartResponse cartResponse){
        
        try{
            
            Product product  = productService.getById(cartResponse.getProduct().getId());

            User user = userRepo.findById(cartResponse.getUserId()).get();

            CartInfo cartInfo = cartInfoRepo.findById(cartResponse.getId()).get();
            cartInfo.setProduct(product);
            cartInfo.setPurchaseQty(cartResponse.getPurchaseQty());
            cartInfo.setPurchaseAmt(product.getProductPrice() * cartResponse.getPurchaseQty());
            cartInfo.setUser(user);

            cartInfoRepo.save(cartInfo);
            
            return true;
            
        } catch(Exception e){
            System.out.println("ERROR IN UPDATING CART");
            System.out.println(e.getMessage());
            return false;
            
        }
       
    }
    
    public List<CartInfo> getByUser(int id){
        
        User user = userRepo.findById(id).get();
        
        return cartInfoRepo.findByUser(user);
        
    }
    
    
    public List<Integer> getCartItemByUserId(int id){
        
        try{
            
            List<CartInfo> cartInfo = getByUser(id);
            
            if(cartInfo != null) {
                
                List<Integer> productIds = new ArrayList<>();

                for(CartInfo cart : cartInfo){

                    productIds.add(cart.getProduct().getId());

                }

                return productIds;
            } else{
                return null;
            }
        
            
        } catch(Exception e){
            return null;
        }
           
    }
    
    public List<CartResponse> getAllCartItems(int id){
        
        try{
            
            List<CartInfo> cartInfo = getByUser(id);
            List<CartResponse> cartResponse = new ArrayList<>();
            if(cartInfo != null){
                
                for(CartInfo cartItem: cartInfo){
                    
                    ProductResponse productResponse = ProductResponse.builder()
                            .id(cartItem.getProduct().getId())
                            .productDesc(cartItem.getProduct().getProductDesc())
                            .productImage(cartItem.getProduct().getProductImage())
                            .productName(cartItem.getProduct().getProductName())
                            .productPrice(cartItem.getProduct().getProductPrice())
                            .productQty(cartItem.getProduct().getProductQty())
                            .inCart(true)
                            .build();
                    
                    cartResponse.add( CartResponse.builder()
                            .id(cartItem.getId())
                            .product(productResponse)
                            .date(cartItem.getDate())
                            .purchaseAmt(cartItem.getPurchaseAmt())
                            .purchaseQty(cartItem.getPurchaseQty())
                            .productId(cartItem.getProduct().getId())
                            .userId(cartItem.getUser().getId())
                            .categoryId(cartItem.getProduct().getCategory().getId())
                            .build());
                }
                
                return cartResponse;
                 
                
            } else{
                return null;
            }
            
        }catch(Exception e){
            return null;
        }
        
    }
    
    
    public CartInfo getCartInfoByProductAndUser(Product p,String email){
    
        User u = userRepo.findByEmail(email);
        CartInfo cartInfo = cartInfoRepo.findByProductAndUser(p, u);
        
        if(cartInfo != null)
            return cartInfo;
        else
            return null;
    
    }
    
    
    public CartInfo getCartById(Integer id){
        
        return cartInfoRepo.findById(id).get();
        
    }
    
    public boolean removeFromCart(Integer id){
        
        CartInfo cart = getCartById(id);
        if(cart != null){
            cartInfoRepo.delete(cart);
            return true;
        }
        return false;
        
    }

    public List<CartDto> getUserCart(Integer userId){
        
        try{
            
            List<CartInfo> cartInfo = getByUser(userId);

            List<CartDto> cartList = new ArrayList<>();

            if(cartInfo != null){
                
                for(CartInfo cartItem: cartInfo){
                    
                    ProductDto productDto = ProductDto.builder()
                            .id(cartItem.getProduct().getId())
                            .productDesc(cartItem.getProduct().getProductDesc())
                            .productImage(cartItem.getProduct().getProductImage())
                            .productName(cartItem.getProduct().getProductName())
                            .productPrice(cartItem.getProduct().getProductPrice())
                            .productQty(cartItem.getProduct().getProductQty())
                            .build();
                    
                    cartList.add( CartDto.builder()
                            .id(cartItem.getId())
                            .product(productDto)
                            .date(cartItem.getDate())
                            .purchaseAmt(cartItem.getPurchaseAmt())
                            .purchaseQty(cartItem.getPurchaseQty())
                            .userId(cartItem.getUser().getId())
                            .categoryId(cartItem.getProduct().getCategory().getId())
                            .build());
                }
                
                return cartList;
                 
                
            } else{
                return null;
            }
            
        }catch(Exception e){
            return null;
        }
        
    }
    
    
}
