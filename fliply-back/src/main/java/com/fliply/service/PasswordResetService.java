package com.fliply.service;

import com.fliply.model.User;
import com.fliply.repository.UserRepository;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;

@Slf4j
@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Value("${password-reset.token.secret}")
    private String tokenSecret;

    @Value("${password-reset.token.expiration}")
    private long tokenExpiration;

    public void sendPasswordResetEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado com este email"));

        String token = generateResetToken(user.getEmail());
        emailService.sendPasswordResetEmail(user.getEmail(), token, user.getName());

        log.info("Email de recuperação de senha enviado para {}", email);
    }

    @Transactional
    public void resetPassword(String token, String newPassword, String confirmPassword) {
        if (newPassword == null || newPassword.isBlank()) {
            throw new IllegalArgumentException("Nova senha não pode estar vazia");
        }

        if (!newPassword.equals(confirmPassword)) {
            throw new IllegalArgumentException("As senhas não conferem");
        }

        if (newPassword.length() < 6) {
            throw new IllegalArgumentException("Senha deve ter pelo menos 6 caracteres");
        }

        String email = validateResetToken(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        log.info("Senha redefinida com sucesso para usuário {}", email);
    }

    public String validateResetToken(String token) {
        try {
            var claims = Jwts.parser()
                    .verifyWith(Keys.hmacShaKeyFor(tokenSecret.getBytes(StandardCharsets.UTF_8)))
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String email = claims.getSubject();
            String type = claims.get("type", String.class);

            if (!"password-reset".equals(type)) {
                throw new JwtException("Token inválido");
            }

            log.debug("Token de reset de senha válido para {}", email);
            return email;
        } catch (JwtException e) {
            log.warn("Token de reset inválido ou expirado: {}", e.getMessage());
            throw new IllegalArgumentException("Token inválido ou expirado");
        }
    }

    private String generateResetToken(String email) {
        return Jwts.builder()
                .subject(email)
                .claim("type", "password-reset")
                .issuedAt(new java.util.Date())
                .expiration(new java.util.Date(System.currentTimeMillis() + tokenExpiration))
                .signWith(Keys.hmacShaKeyFor(tokenSecret.getBytes(StandardCharsets.UTF_8)))
                .compact();
    }
}
