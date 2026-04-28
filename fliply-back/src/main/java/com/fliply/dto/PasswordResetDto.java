package com.fliply.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class PasswordResetDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ForgotPasswordRequest {
        private String email;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ForgotPasswordResponse {
        private String message;
        private String email;

        public static ForgotPasswordResponse success(String email) {
            return ForgotPasswordResponse.builder()
                    .message("Email de recuperação enviado! Verifique sua caixa de entrada.")
                    .email(email)
                    .build();
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ResetPasswordRequest {
        private String token;
        private String newPassword;
        private String confirmPassword;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ResetPasswordResponse {
        private String message;
        private Boolean success;

        public static ResetPasswordResponse success() {
            return ResetPasswordResponse.builder()
                    .message("Senha alterada com sucesso! Faça login com sua nova senha.")
                    .success(true)
                    .build();
        }

        public static ResetPasswordResponse failure(String message) {
            return ResetPasswordResponse.builder()
                    .message(message)
                    .success(false)
                    .build();
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ValidateTokenRequest {
        private String token;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ValidateTokenResponse {
        private Boolean valid;
        private String message;
        private String email;

        public static ValidateTokenResponse valid(String email) {
            return ValidateTokenResponse.builder()
                    .valid(true)
                    .message("Token válido")
                    .email(email)
                    .build();
        }

        public static ValidateTokenResponse invalid(String message) {
            return ValidateTokenResponse.builder()
                    .valid(false)
                    .message(message)
                    .build();
        }
    }
}
