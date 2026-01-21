package com.springboot.service;

import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.stereotype.Service;

@Service
public class CustomFunctions {
    
     public static String extractGender(String query) {
        List<String> genderKeywords = Arrays.asList("men", "women", "boy", "girl", "unisex","male","female");
        for (String gender : genderKeywords) {
            if (query.toLowerCase().contains(gender)) {
                return gender;
            }
        }
        return null;
    }
     
    public static Integer extractMinPrice(String query) {
        Pattern pattern = Pattern.compile("(above|more than|over|between)\\s*(\\d+)");
        Matcher matcher = pattern.matcher(query.toLowerCase());

        if (matcher.find()) {
            return Integer.valueOf(matcher.group(2)); // group 2 means 400 500 numeric value
        }
        return null;
    }
    
    public static Integer extractMaxPrice(String query) {
        Pattern pattern = Pattern.compile("(below|less than|under|and)\\s*(\\d+)");
        Matcher matcher = pattern.matcher(query.toLowerCase());

        if (matcher.find()) {
            return Integer.valueOf(matcher.group(2)); // group 2 means 400 500 numeric value
        }
        return null;
    }
    
    public static String extractProductName(String query, String gender, Integer minPrice, Integer maxPrice) {
        String cleanedQuery = query.toLowerCase();

        if (minPrice != null) {
            cleanedQuery = cleanedQuery.replaceAll("(above|more than|over|between)\\s*(\\d+)", "");
        }
        
        if (maxPrice != null) {
            cleanedQuery = cleanedQuery.replaceAll("(below|less than|under|and)\\s*(\\d+)", "");
        }
        
        return toBooleanSearch(cleanedQuery.trim());
                
    }
    
    public static String getSectionName(String sectionName){
        
        List<String> maleGenderKeywords = Arrays.asList( "men", "boy", "unisex","male");
        for (String gender : maleGenderKeywords) {
            if (sectionName.toLowerCase().equals(gender)) {
                return "Men";
            }
        }
        
        List<String> femaleGenderKeywords = Arrays.asList( "women", "girl", "unisex","female");
        for (String gender : femaleGenderKeywords) {
            if (sectionName.toLowerCase().equals(gender)) {
                return "Women";
            }
        }
        
        return null;
        
    }
    
    public static String toBooleanSearch(String userInput) {
        if (userInput == null || userInput.isBlank()) return "";

        Set<String> stopWords = Set.of(
            "a", "an", "the", "for", "and", "or", "but", "to", "with", "in", "on", "at", "by", "of", "is", "are"
        );

        String[] words = userInput.split("\\s+");

        StringBuilder sb = new StringBuilder();
        for (String word : words) {
            if (!stopWords.contains(word) && !word.isBlank()) {
                
                if (word.endsWith("es")) {
                    word= word.substring(0, word.length() - 2);
                } else if (word.endsWith("s")) {
                    word = word.substring(0, word.length() - 1);
                }
                
                if (word.contains("-")) {
                    
                    sb.append("+").append("\"").append(word).append("\" "); // Preserve hyphen as part of word
                    
                } else{
                    sb.append("+").append(word).append("* ");
                }
            }
        }

        return sb.toString().trim();
    }

    
}
