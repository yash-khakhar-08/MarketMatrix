# E-Commerece-Project-in-React-JS-using-REST-API

MarketMatrix is an online shopping project built with REACT JS and Java Spring Boot MVC. This web application provides a good user experience through a frontend developed with React JS.

The backend uses REST API developed in Spring Boot for clean, structured code with a service layer, Spring Data JPA for efficient database operations using MySQL, and Spring Security to protect user data with authentication and role-based authorization.

---

## Features (User side)

✅ User authentication (Login/Register)  
✅ Product listing & search  
✅ Add to cart and place order  
✅ View order and cancel order  

## Features (Admin side)  

✅ Admin authentication (Login)  
✅ Manage category and Product  
✅ Manage Customers and Orders  

---

## Technologies Used

* **REST API built in Spring Boot MVC Architecture** (Backend)
* **REACT JS | HTML | Bootstrap** (Frontend)
* **MySQL** (Database)
* **Spring Data JPA** (Simplified data access and database queries with custom JPA finder methods.)
* **Spring Security** (Role based Authentication)
* **Maven** (Build tool for project management and dependency management.)

---

## ⚙️ Configuration Setup

Before running the project, configure the `application.properties` file.

### Step 1: Navigate to

```
src/main/resources/application.properties
```

### Step 2: Add the following configuration

```
# DATABASE CONFIG
spring.datasource.url=jdbc:mysql://localhost:3306/marketmatrix
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# FILE UPLOAD
file.upload-dir=uploads/products

# STRIPE PAYMENT
stripe.secret.key=YOUR_STRIPE_SECRET_KEY

# EMAIL CONFIG
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=YOUR_EMAIL
spring.mail.password=YOUR_APP_PASSWORD
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# CLOUDINARY
cloudinary.cloud_name=YOUR_CLOUD_NAME
cloudinary.api_key=YOUR_API_KEY
cloudinary.api_secret=YOUR_API_SECRET

# KAFKA CONFIG
spring.kafka.bootstrap-servers=localhost:9092

spring.kafka.consumer.group-id=order-group
spring.kafka.consumer.auto-offset-reset=earliest

spring.kafka.consumer.key-deserializer=org.springframework.kafka.support.serializer.ErrorHandlingDeserializer
spring.kafka.consumer.value-deserializer=org.springframework.kafka.support.serializer.ErrorHandlingDeserializer

spring.kafka.consumer.properties.spring.deserializer.key.delegate.class=org.apache.kafka.common.serialization.StringDeserializer
spring.kafka.consumer.properties.spring.deserializer.value.delegate.class=org.springframework.kafka.support.serializer.JsonDeserializer

spring.kafka.consumer.properties.spring.json.trusted.packages=*
spring.kafka.consumer.properties.spring.json.value.default.type=com.springboot.events.OrderPlacedEvent

spring.kafka.producer.key-serializer=org.apache.kafka.common.serialization.StringSerializer
spring.kafka.producer.value-serializer=org.springframework.kafka.support.serializer.JsonSerializer

spring.kafka.listener.missing-topics-fatal=false

# GOOGLE OAUTH
spring.security.oauth2.client.registration.google.client-id=YOUR_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_CLIENT_SECRET
spring.security.oauth2.client.registration.google.scope=profile,email
spring.security.oauth2.client.provider.google.authorization-uri=https://accounts.google.com/o/oauth2/v2/auth?prompt=select_account
```

---

## 🔑 Notes

* Replace all `YOUR_*` values with your actual credentials
* Do not commit real credentials to GitHub
* Make sure required services are running:

  * MySQL
  * Kafka
  * Internet (for Stripe, Email, OAuth, Cloudinary)

---


