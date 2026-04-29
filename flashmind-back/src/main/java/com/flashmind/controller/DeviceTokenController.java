package com.flashmind.controller;

import com.flashmind.model.DeviceToken;
import com.flashmind.model.User;
import com.flashmind.repository.DeviceTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/device-tokens")
@RequiredArgsConstructor
public class DeviceTokenController {

    private final DeviceTokenRepository deviceTokenRepository;

    @PostMapping
    @Transactional
    public ResponseEntity<Map<String, String>> register(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> body) {

        String token = body.get("token");
        String platform = body.getOrDefault("platform", "android");

        if (token == null || token.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Token é obrigatório"));
        }

        Optional<DeviceToken> existing = deviceTokenRepository.findByUserAndToken(user, token);

        if (existing.isPresent()) {
            DeviceToken dt = existing.get();
            dt.setActive(true);
            dt.setLastUsedAt(LocalDateTime.now());
            deviceTokenRepository.save(dt);
            log.debug("Device token reativado para usuário {}", user.getId());
        } else {
            DeviceToken dt = DeviceToken.builder()
                    .user(user)
                    .token(token)
                    .platform(platform)
                    .lastUsedAt(LocalDateTime.now())
                    .build();
            deviceTokenRepository.save(dt);
            log.info("Device token registrado para usuário {} ({})", user.getId(), platform);
        }

        return ResponseEntity.ok(Map.of("status", "registered"));
    }

    @DeleteMapping
    @Transactional
    public ResponseEntity<Void> unregister(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> body) {

        String token = body.get("token");
        if (token != null && !token.isBlank()) {
            deviceTokenRepository.deactivateByToken(token);
            log.info("Device token removido para usuário {}", user.getId());
        }

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/all")
    @Transactional
    public ResponseEntity<Void> unregisterAll(@AuthenticationPrincipal User user) {
        deviceTokenRepository.deactivateAllByUser(user);
        log.info("Todos device tokens removidos para usuário {}", user.getId());
        return ResponseEntity.noContent().build();
    }
}
