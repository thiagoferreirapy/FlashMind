package com.flashmind.controller;

import com.flashmind.dto.ReminderDto;
import com.flashmind.model.Deck;
import com.flashmind.model.Reminder;
import com.flashmind.model.User;
import com.flashmind.repository.DeckRepository;
import com.flashmind.repository.ReminderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reminders")
@RequiredArgsConstructor
public class ReminderController {

    private final ReminderRepository reminderRepository;
    private final DeckRepository deckRepository;

    @GetMapping
    public ResponseEntity<List<ReminderDto.Response>> getReminders(@AuthenticationPrincipal User user) {
        List<ReminderDto.Response> result = reminderRepository
                .findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(ReminderDto.Response::from)
                .toList();
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<ReminderDto.Response> createReminder(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> body) {
        String timeStr = (String) body.get("timeOfDay");
        String deckIdStr = body.get("deckId") != null ? body.get("deckId").toString() : null;

        Deck deck = null;
        if (deckIdStr != null && !deckIdStr.equals("null")) {
            deck = deckRepository.findByIdAndUser(Long.parseLong(deckIdStr), user).orElse(null);
        }

        Reminder reminder = Reminder.builder()
            .user(user)
            .title((String) body.get("title"))
            .description((String) body.get("description"))
            .type((String) body.get("type"))
            .deck(deck)
            .timeOfDay(timeStr != null ? LocalTime.parse(timeStr) : LocalTime.of(8, 0))
            .frequency(body.getOrDefault("frequency", "daily").toString())
            .channel(body.getOrDefault("channel", "push").toString())
            .isActive(body.get("isActive") == null || (Boolean) body.get("isActive"))
            .build();

        return ResponseEntity.ok(ReminderDto.Response.from(reminderRepository.save(reminder)));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ReminderDto.Response> patchReminder(
            @PathVariable Long id,
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> body) {
        Reminder reminder = reminderRepository.findByIdAndUser(id, user)
            .orElseThrow(() -> new IllegalArgumentException("Lembrete não encontrado"));

        if (body.containsKey("isActive"))    reminder.setIsActive((Boolean) body.get("isActive"));
        if (body.containsKey("title"))       reminder.setTitle((String) body.get("title"));
        if (body.containsKey("description")) reminder.setDescription((String) body.get("description"));
        if (body.containsKey("type"))        reminder.setType((String) body.get("type"));
        if (body.containsKey("frequency"))   reminder.setFrequency((String) body.get("frequency"));
        if (body.containsKey("channel"))     reminder.setChannel((String) body.get("channel"));
        if (body.containsKey("timeOfDay")) {
            String t = (String) body.get("timeOfDay");
            if (t != null) reminder.setTimeOfDay(java.time.LocalTime.parse(t));
        }
        if (body.containsKey("deckId")) {
            String deckIdStr = body.get("deckId") != null ? body.get("deckId").toString() : null;
            if (deckIdStr == null || deckIdStr.equals("null")) {
                reminder.setDeck(null);
            } else {
                deckRepository.findByIdAndUser(Long.parseLong(deckIdStr), user).ifPresent(reminder::setDeck);
            }
        }

        return ResponseEntity.ok(ReminderDto.Response.from(reminderRepository.save(reminder)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReminder(@PathVariable Long id, @AuthenticationPrincipal User user) {
        Reminder reminder = reminderRepository.findByIdAndUser(id, user)
            .orElseThrow(() -> new IllegalArgumentException("Lembrete não encontrado"));
        reminderRepository.delete(reminder);
        return ResponseEntity.noContent().build();
    }
}
