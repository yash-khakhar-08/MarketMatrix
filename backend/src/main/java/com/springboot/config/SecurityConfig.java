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
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.springboot.Dto.LoginResponseDto;
import com.springboot.service.GoogleAuthService;
import com.springboot.service.JwtService;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
   
    @Autowired
    private JwtFilter jwtFilter;

    @Autowired
    private GoogleAuthService googleAuthService;
    
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
        
        // System.out.println("dao auth method ");
        
        // DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider(getDetailsService());
        // daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());

        System.out.println("dao auth method");

        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();

        provider.setUserDetailsService(getDetailsService());
        provider.setPasswordEncoder(passwordEncoder());

        return provider;
        
        //return daoAuthenticationProvider;
        
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/getProducts","/getCategories",
                        "/getRelatedProducts","/search-product",
                        "/api/auth/**", "/filterProducts/**",
                        "/getAllProducts", "/login/**").permitAll()
                .requestMatchers("/user/**").hasRole("USER")
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/products/**").permitAll()
                .anyRequest().authenticated()
            )

            .oauth2Login(oauth2 -> oauth2
                .successHandler((request, response, authentication) -> {

                    OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

                    String email = oAuth2User.getAttribute("email");
                    String name = oAuth2User.getAttribute("name");

                    System.out.println("Email: " + email);
                    System.out.println("Name: " + name);

                    String token = googleAuthService.login(email, name);

                    // Redirect to frontend
                    response.sendRedirect("http://localhost:3000/oauth-success?token=" + token);

                })
            )

            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            )

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
