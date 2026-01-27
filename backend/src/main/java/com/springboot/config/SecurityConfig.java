package com.springboot.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
   
    @Autowired
    private JwtFilter jwtFilter;
    
    
    @Bean
    public PasswordEncoder passwordEncoder(){
        
        System.out.println("password encoder method ");
        
        return new BCryptPasswordEncoder();
        
    }
    
    
    @Bean
    public UserDetailsService getDetailsService(){
        System.out.println("user details service method ");
        
        return new CustomUserDetailsService();
    }
    
    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider(){
        
        System.out.println("dao auth method ");
        
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider(getDetailsService());
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
        
        return daoAuthenticationProvider;
        
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        
        System.out.println("Security chain method ");
        
        http
                
            .csrf(csrf -> csrf.disable()) 
                 .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/getProducts","/getCategories",
                            "/getRelatedProducts","/search-product", 
                            "/api/auth/**", "/filterProducts/**",
                            "/getAllProducts").permitAll()  
                    .requestMatchers("/user/**").hasRole("USER")
                    .requestMatchers("/admin/**").hasAuthority("ROLE_ADMIN")
                    .requestMatchers(HttpMethod.GET, "/products/**").permitAll()
                .anyRequest().authenticated()
                    
            )
            .httpBasic(httpBasic -> httpBasic.disable())
            .logout(logout -> logout
                .logoutUrl("/logout")
                    .permitAll()
            )
                 .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                 .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);  
        
        return http.build();
        
    }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception{
        
        return authenticationConfiguration.getAuthenticationManager();
        
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000")); // Specify allowed origins
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Specify allowed methods
        configuration.setAllowedHeaders(List.of("*")); // Allow all headers
        configuration.setAllowCredentials(true); // Allow credentials (e.g., cookies)
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Apply CORS settings to all endpoints
        return source;
    }
    
}
