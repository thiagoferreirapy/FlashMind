package com.fliply.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.name:Fliply}")
    private String appName;

    @Value("${password-reset.frontend-url}")
    private String resetPasswordUrl;

    public void sendPasswordResetEmail(String toEmail, String token, String userName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(appName + " - Recuperar Senha");

            String resetLink = resetPasswordUrl + "?token=" + token;
            String htmlContent = buildPasswordResetEmail(userName, resetLink);

            helper.setText(htmlContent, true);
            mailSender.send(message);

            log.info("Email de recuperação de senha enviado para {}", toEmail);
        } catch (MessagingException e) {
            log.error("Erro ao enviar email para {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Erro ao enviar email de recuperação");
        }
    }

    public void sendWelcomeEmail(String toEmail, String userName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Bem-vindo ao " + appName + "!");
            message.setText(
                "Olá " + userName + ",\n\n" +
                "Sua conta foi criada com sucesso! 🎉\n\n" +
                "Comece a criar seus decks e estude de forma inteligente.\n\n" +
                "Abraços,\n" +
                "Time " + appName
            );
            mailSender.send(message);

            log.info("Email de boas-vindas enviado para {}", toEmail);
        } catch (Exception e) {
            log.warn("Erro ao enviar email de boas-vindas para {}: {}", toEmail, e.getMessage());
        }
    }

    private String buildPasswordResetEmail(String userName, String resetLink) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<meta charset=\"UTF-8\">" +
                "<style>" +
                "body { font-family: Arial, sans-serif; color: #333; }" +
                ".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                ".header { background: linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }" +
                ".content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }" +
                ".button { display: inline-block; background: linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }" +
                ".warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin: 20px 0; }" +
                ".footer { color: #999; font-size: 12px; margin-top: 30px; text-align: center; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class=\"container\">" +
                "<div class=\"header\"><h1>Recuperar Senha</h1></div>" +
                "<div class=\"content\">" +
                "<p>Olá <strong>" + userName + "</strong>,</p>" +
                "<p>Recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo para continuar:</p>" +
                "<div style=\"text-align: center;\">" +
                "<a href=\"" + resetLink + "\" class=\"button\">Redefinir Senha</a>" +
                "</div>" +
                "<p>Ou copie e cole este link no seu navegador:</p>" +
                "<p style=\"word-break: break-all; color: #666;\"><code>" + resetLink + "</code></p>" +
                "<div class=\"warning\">" +
                "<strong>⚠️ Importante:</strong> Este link expira em 1 hora. Se você não solicitou essa alteração, ignore este email." +
                "</div>" +
                "<p>Se tiver dúvidas, entre em contato conosco.</p>" +
                "<div class=\"footer\">" +
                "<p>© " + appName + " 2026 - Plataforma de Flashcards Inteligentes</p>" +
                "<p>Este é um email automático, não responda.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
}
