package com.springboot.JsonResponse;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CategoryResponse {
    
    private int id;
    
    private String catName;
    
    private String sectionName;
    
    private List<ProductResponse> productResponse;
    
}
