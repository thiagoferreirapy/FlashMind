package com.flashmind.controller;

import com.flashmind.dto.PasswordResetDto;
import com.flashmind.service.PasswordResetService;
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

    @PostMapping("/reset-password-direct")
    public ResponseEntity<PasswordResetDto.ResetPasswordResponse> resetPasswordDirect(
            @Valid @RequestBody PasswordResetDto.DirectResetRequest request) {

        try {
            passwordResetService.resetPasswordDirect(
                request.getEmail(),
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
