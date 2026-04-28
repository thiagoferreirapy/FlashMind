package com.fliply.controller;

import com.fliply.dto.PasswordResetDto;
import com.fliply.service.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    @PostMapping("/forgot-password")
    public ResponseEntity<PasswordResetDto.ForgotPasswordResponse> forgotPassword(
            @Valid @RequestBody PasswordResetDto.ForgotPasswordRequest request) {

        String email = request.getEmail();
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(
                PasswordResetDto.ForgotPasswordResponse.builder()
                    .message("Email é obrigatório")
                    .build()
            );
        }

        try {
            passwordResetService.sendPasswordResetEmail(email);
            return ResponseEntity.ok(PasswordResetDto.ForgotPasswordResponse.success(email));
        } catch (IllegalArgumentException e) {
            log.warn("Tentativa de recuperação de senha para email não registrado: {}", email);
            return ResponseEntity.ok(PasswordResetDto.ForgotPasswordResponse.success(email));
        } catch (Exception e) {
            log.error("Erro ao enviar email de recuperação: {}", e.getMessage());
            return ResponseEntity.status(500).body(
                PasswordResetDto.ForgotPasswordResponse.builder()
                    .message("Erro ao processar solicitação. Tente novamente mais tarde.")
                    .build()
            );
        }
    }

    @PostMapping("/validate-reset-token")
    public ResponseEntity<PasswordResetDto.ValidateTokenResponse> validateToken(
            @Valid @RequestBody PasswordResetDto.ValidateTokenRequest request) {

        try {
            String email = passwordResetService.validateResetToken(request.getToken());
            return ResponseEntity.ok(PasswordResetDto.ValidateTokenResponse.valid(email));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                PasswordResetDto.ValidateTokenResponse.invalid(e.getMessage())
            );
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<PasswordResetDto.ResetPasswordResponse> resetPassword(
            @Valid @RequestBody PasswordResetDto.ResetPasswordRequest request) {

        if (request.getToken() == null || request.getToken().isBlank()) {
            return ResponseEntity.badRequest().body(
                PasswordResetDto.ResetPasswordResponse.failure("Token é obrigatório")
            );
        }

        try {
            passwordResetService.resetPassword(
                request.getToken(),
                request.getNewPassword(),
                request.getConfirmPassword()
            );
            return ResponseEntity.ok(PasswordResetDto.ResetPasswordResponse.success());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                PasswordResetDto.ResetPasswordResponse.failure(e.getMessage())
            );
        } catch (Exception e) {
            log.error("Erro ao redefinir senha: {}", e.getMessage());
            return ResponseEntity.status(500).body(
                PasswordResetDto.ResetPasswordResponse.failure("Erro ao redefinir senha. Tente novamente.")
            );
        }
    }
}
