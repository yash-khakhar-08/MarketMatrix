package com.springboot.service;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ImageUploadService {

    private final Cloudinary cloudinary;

    @SuppressWarnings("unchecked")
    public String uploadProductImage(MultipartFile file) {
        try {
            Map<String, Object> uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                    "folder", "marketmatrix/products",
                    "resource_type", "image"
                )
            );

            return uploadResult.get("secure_url").toString();

        } catch (IOException e) {
            throw new RuntimeException("Image upload failed: " + e.getMessage());
        }
    }

}
