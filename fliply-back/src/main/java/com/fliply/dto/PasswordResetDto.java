package com.fliply.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class PasswordResetDto {

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class DirectResetRequest {
        private String email;
        private String newPassword;
        private String confirmPassword;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
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
}
