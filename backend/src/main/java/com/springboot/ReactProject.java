package com.springboot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;

@EnableKafka
@SpringBootApplication
public class ReactProject {

    public static void main(String[] args) {
        
        SpringApplication.run(ReactProject.class, args);
    }

}


