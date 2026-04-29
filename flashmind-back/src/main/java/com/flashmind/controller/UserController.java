package com.flashmind.controller;

import com.flashmind.dto.UserDto;
import com.flashmind.model.User;
import com.flashmind.model.UserSettings;
import com.flashmind.repository.UserRepository;
import com.flashmind.repository.UserSettingsRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final UserSettingsRepository settingsRepository;

    @GetMapping("/me")
    public ResponseEntity<UserDto> getMe(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(UserDto.from(user));
    }

    @PutMapping("/me")
    public ResponseEntity<UserDto> updateMe(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> body) {
        if (body.containsKey("name"))          user.setName(body.get("name"));
        if (body.containsKey("email"))         user.setEmail(body.get("email"));
        if (body.containsKey("whatsappPhone")) user.setWhatsappPhone(body.get("whatsappPhone"));
        if (body.containsKey("timezone"))      user.setTimezone(body.get("timezone"));
        user = userRepository.save(user);
        return ResponseEntity.ok(UserDto.from(user));
    }

    @org.springframework.transaction.annotation.Transactional
    @GetMapping("/settings")
    public ResponseEntity<UserSettings> getSettings(@AuthenticationPrincipal User user) {
        UserSettings s = settingsRepository.findByUser(user)
            .orElseGet(() -> settingsRepository.save(UserSettings.builder().user(user).build()));
        return ResponseEntity.ok(s);
    }

    @org.springframework.transaction.annotation.Transactional
    @PatchMapping("/settings")
    public ResponseEntity<UserSettings> patchSettings(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> body) {
        UserSettings s = settingsRepository.findByUser(user)
            .orElseGet(() -> UserSettings.builder().user(user).build());

        if (body.containsKey("dailyGoal"))            s.setDailyGoal((Integer) body.get("dailyGoal"));
        if (body.containsKey("sessionSize"))          s.setSessionSize((Integer) body.get("sessionSize"));
        if (body.containsKey("smartOrder"))           s.setSmartOrder((Boolean) body.get("smartOrder"));
        if (body.containsKey("whatsappEnabled"))      s.setWhatsappEnabled((Boolean) body.get("whatsappEnabled"));
        if (body.containsKey("notificationsEnabled")) s.setNotificationsEnabled((Boolean) body.get("notificationsEnabled"));
        if (body.containsKey("whatsappPreferredTime")) {
            String t = (String) body.get("whatsappPreferredTime");
            s.setWhatsappTime(t != null ? java.time.LocalTime.parse(t) : null);
        }
        if (body.containsKey("whatsappDeckId")) {
            Object val = body.get("whatsappDeckId");
            s.setWhatsappDeckId(val != null ? Long.valueOf(val.toString()) : null);
        }

        return ResponseEntity.ok(settingsRepository.save(s));
    }
}
