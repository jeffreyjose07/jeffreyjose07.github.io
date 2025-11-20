---
title: "Building a Secure Password Reset Flow"
date: "2025-11-20"
tags: ["Spring Boot", "React", "Security", "Brevo"]
description: "A deep dive into implementing a secure, token-based password reset system using Spring Boot, React, and Brevo email service."
readingTime: 5
wordCount: 800
---

Implementing a secure **forgot password** feature is a critical requirement for any authentication system. In this post, I'll walk through how we added a robust password reset flow to the **Scalable Chat Platform**, leveraging **Spring Boot** for the backend, **React** for the frontend, and **Brevo** (formerly Sendinblue) for reliable email delivery.

## The Architecture

The flow follows a standard secure pattern:
1. User requests a password reset via email.
2. Backend generates a unique, time-limited token.
3. An email containing a link with this token is sent to the user.
4. User clicks the link, landing on a frontend page to enter a new password.
5. Frontend sends the token and new password to the backend.
6. Backend validates the token and updates the password.

## Backend Implementation

### The Controller Layer

We extended our `AuthController` to handle two new endpoints:

```java
@PostMapping("/forgot-password")
public ResponseEntity<MessageResponse<Void>> forgotPassword(
        @Valid @RequestBody ForgotPasswordRequest request) {
    try {
        authService.sendPasswordResetEmail(request.email());
        return ResponseUtils.success(Constants.PASSWORD_RESET_EMAIL_SENT);
    } catch (Exception e) {
        // Security: Always return success to prevent email enumeration
        return ResponseUtils.success(Constants.PASSWORD_RESET_EMAIL_SENT);
    }
}
```

> [!NOTE]
> Notice the security best practice here: we always return a success message, even if the email doesn't exist in our system. This prevents attackers from enumerating valid email addresses.

### Email Service with Brevo

Reliable email delivery is crucial. We integrated **Brevo** using their transactional email API. The `BrevoEmailService` constructs a professional HTML email template:

```java
@Service
public class BrevoEmailService implements EmailService {
    // ... initialization ...

    @Override
    public void sendPasswordResetEmail(String to, String resetToken, String userName) {
        String resetLink = frontendUrl + "/reset-password?token=" + resetToken;
        
        // Construct HTML content
        String htmlContent = buildPasswordResetEmailHtml(userName, resetLink);
        
        SendSmtpEmail email = new SendSmtpEmail();
        email.setTo(List.of(new SendSmtpEmailTo().email(to)));
        email.setHtmlContent(htmlContent);
        
        apiInstance.sendTransacEmail(email);
    }
}
```

We use environment variables to securely store the API key and configure the sender address.

## Frontend Implementation

### The Reset Page

On the **React** side, we created a `ResetPasswordPage` that captures the token from the URL query parameters:

```typescript
const [searchParams] = useSearchParams();
const token = searchParams.get('token');
```

### Password Strength Meter

To encourage better security, we implemented a real-time password strength meter. It analyzes the password complexity based on length, case sensitivity, numbers, and special characters:

```typescript
const calculatePasswordStrength = (password: string) => {
    if (password.length >= 12 && hasAllComplexityRequirements(password)) {
        return 'strong'; // Green
    } else if (password.length >= 8 && hasSomeComplexity(password)) {
        return 'medium'; // Yellow
    }
    return 'weak'; // Red
};
```

This gives users immediate visual feedback, guiding them to create stronger credentials.

## Security Considerations

We implemented several layers of security:

1. **Token Expiration**: Reset tokens have a short lifespan (30 minutes) to minimize the attack window.
2. **HTTPS**: All communication happens over encrypted channels.
3. **Input Validation**: Strict validation on both frontend and backend ensures passwords meet complexity requirements.
4. **Environment Isolation**: API keys and sensitive configuration are kept in environment variables, never in the code.

## Conclusion

Adding this feature significantly improves the user experience and security of the platform. By combining **Spring Boot's** robust security features with **React's** interactive UI and **Brevo's** reliable delivery, we've created a seamless recovery flow.

Check out the full implementation in the [Scalable Chat Platform](https://github.com/jeffreyjose07/scalable-chat-platform) repository.
