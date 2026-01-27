package com.springboot.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.springboot.models.Orders;
import com.springboot.models.Product;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendOtpCodeEmail(String email, int otpCode, String subject){

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setSubject(subject);
        message.setText("OTP Code: " + otpCode);
        message.setFrom("yashkhakhkhar455@gmail.com");

        mailSender.send(message);

    }

    @Async
    public void sendAccountVerificationEmail(String email, int otpCode)
     throws MessagingException{

        String verificationLink = "http://localhost:3000/verify-account?email="+email+"&token="+otpCode;

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(email);
        helper.setSubject("MarketMatrix - Account Verification");
        helper.setFrom("yashkhakhkhar455@gmail.com");

        String htmlContent = """
            <html>
                <body>
                    <h2>Verify your account</h2>
                    <p>Click the button below to verify your account:</p>
                    <a href="%s"
                       style="padding:10px 16px;
                              background:#4CAF50;
                              color:white;
                              text-decoration:none;
                              border-radius:5px;">
                        Verify Account
                    </a>
                    <p>If the button doesn’t work, copy & paste this link:</p>
                    <p>%s</p>
                </body>
            </html>
        """.formatted(verificationLink, verificationLink);
        
        helper.setText(htmlContent, true);

        mailSender.send(message);

    }

    @Async
    public void sendOrderSummaryEmail(List<Orders> orders)
        throws MessagingException {

        double totalAmount = orders.stream()
                .mapToDouble(Orders::getPurchaseAmt)
                .sum();

        StringBuilder productsHtml = new StringBuilder();

        for (Orders order : orders) {
            
            Product p = order.getProduct();

            productsHtml.append("""
                <tr>
                    <td><img src="%s" width="60"/></td>
                    <td>%s</td>
                    <td>₹%s</td>
                    <td>%d</td>
                </tr>
            """.formatted(
                p.getProductImage(),
                p.getProductName(),
                p.getProductPrice(),
                order.getPurchaseQty()
            ));
        }

        String html = """
            <h2>Order Placed Successfully 🎉</h2>
            <p><strong>Total Amount:</strong> ₹%s</p>
            <p><strong>Order status:</strong> Pending</p>
            <p><strong>Expected Delivery: </strong> Within 7-10 business days.</p>
            <p><strong>Payment mode:</strong> %s</p>

            <table border="1" cellpadding="8" cellspacing="0">
                <tr>
                    <th>Image</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Qty</th>
                </tr>
                %s
            </table>
            <br/>
            <h5>For any order related queries, please email us at 
            <a href="mailto:yashkhakhkhar455@gmail.com">yashkhakhkhar455@gmail.com</a> 
            </h5>
            <p>From,<br/>MarketMatrix team</p>
        """.formatted(
            totalAmount,
            orders.get(0).getPaymentMode(),
            productsHtml
        );

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(orders.get(0).getUser().getEmail());
        helper.setSubject("MarketMatrix - Order Confirmation");
        helper.setFrom("yashkhakhkhar455@gmail");
        helper.setText(html, true);

        mailSender.send(message);

    }

    @Async
    public void sendOrderCancellationEmail(Orders order)
        throws MessagingException {

        StringBuilder productsHtml = new StringBuilder();

        Product p = order.getProduct();

        productsHtml.append("""
            <tr>
                <td><img src="%s" width="60"/></td>
                <td>%s</td>
                <td>₹%s</td>
                <td>%d</td>
            </tr>
        """.formatted(
            p.getProductImage(),
            p.getProductName(),
            order.getPurchaseAmt(),
            order.getPurchaseQty()
        ));
        

        String html = """
            <h2>Your Order is Cancelled!</h2>
            <p><strong>Order Id:</strong> %s</p>
            <p><strong>Total Amount to be refunded:</strong> ₹%s</p>
            <p><strong>Order status:</strong> Cancelled</p>
            <p><strong>Expected Refund: </strong> Within 7-10 business days.</p>

            <table border="1" cellpadding="8" cellspacing="0">
                <tr>
                    <th>Image</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Qty</th>
                </tr>
                %s
            </table>
            <br/>
            <h5>For any order related queries, please email us at 
            <a href="mailto:yashkhakhkhar455@gmail.com">yashkhakhkhar455@gmail.com</a> 
            </h5>
            <p>From,<br/>MarketMatrix team</p>
        """.formatted(
            order.getId(),
            order.getPurchaseAmt(),
            productsHtml
        );

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(order.getUser().getEmail());
        helper.setSubject("MarketMatrix - Order Cancellation Confirmation");
        helper.setFrom("yashkhakhkhar455@gmail");
        helper.setText(html, true);

        mailSender.send(message);

    }

    @Async
    public void sendOrderDeliveredEmail(Orders order)
        throws MessagingException {

        StringBuilder productsHtml = new StringBuilder();

        Product p = order.getProduct();

        productsHtml.append("""
            <tr>
                <td><img src="%s" width="60"/></td>
                <td>%s</td>
                <td>₹%s</td>
                <td>%d</td>
            </tr>
        """.formatted(
            p.getProductImage(),
            p.getProductName(),
            order.getPurchaseAmt(),
            order.getPurchaseQty()
        ));
        

        String html = """
            <h2>Order Delivered Successfully 🎉</h2>
            <p><strong>Order Id:</strong> %s</p>
            <p><strong>Product Name:</strong> ₹%s</p>
            <p><strong>Purchase quantity:</strong> ₹%s</p>
            <p><strong>Amount paid:</strong> ₹%s</p>
            <p><strong>Payment mode:</strong> ₹%s</p>

            <table border="1" cellpadding="8" cellspacing="0">
                <tr>
                    <th>Image</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Qty</th>
                </tr>
                %s
            </table>
            <br/>
            <h5>For any order related queries, please email us at 
            <a href="mailto:yashkhakhkhar455@gmail.com">yashkhakhkhar455@gmail.com</a> 
            </h5>
            <p>From,<br/>MarketMatrix team</p>
        """.formatted(
            order.getId(),
            order.getProduct().getProductName(),
            order.getPurchaseQty(),
            order.getPurchaseAmt(),
            order.getPaymentMode(),
            productsHtml
        );

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(order.getUser().getEmail());
        helper.setSubject("MarketMatrix - Order Delivered Confirmation");
        helper.setFrom("yashkhakhkhar455@gmail");
        helper.setText(html, true);

        mailSender.send(message);

    }

}
