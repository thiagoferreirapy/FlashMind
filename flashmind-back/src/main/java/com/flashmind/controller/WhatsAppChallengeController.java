package com.flashmind.controller;

import com.flashmind.model.Card;
import com.flashmind.model.User;
import com.flashmind.model.UserSettings;
import com.flashmind.model.WhatsAppChallenge;
import com.flashmind.repository.CardRepository;
import com.flashmind.repository.UserSettingsRepository;
import com.flashmind.repository.WhatsAppChallengeRepository;
import com.flashmind.service.WhatsAppService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/whatsapp")
@RequiredArgsConstructor
public class WhatsAppChallengeController {

    private final WhatsAppService whatsAppService;
    private final WhatsAppChallengeRepository challengeRepository;
    private final CardRepository cardRepository;
    private final UserSettingsRepository settingsRepository;

    @PostMapping("/send-now")
    public ResponseEntity<Map<String, Object>> sendNow(
            @AuthenticationPrincipal User user,
            @RequestBody(required = false) Map<String, Object> body) {

        String phone = user.getWhatsappPhone();
        if (phone == null || phone.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Nenhum número WhatsApp vinculado ao perfil"
            ));
        }

        UserSettings settings = settingsRepository.findByUser(user)
                .orElseGet(() -> UserSettings.builder().user(user).build());

        Card card = null;
        if (body != null && body.containsKey("cardId")) {
            Long cardId = Long.valueOf(body.get("cardId").toString());
            card = cardRepository.findById(cardId).orElse(null);
        }

        WhatsAppChallenge challenge = new WhatsAppChallenge();
        challenge.setUser(user);
        challenge.setPhone(phone.replaceAll("[^0-9]", ""));
        challenge.setStatus("queued");

        if (card != null) {
            challenge.setCard(card);
            challenge.setFrontText(card.getFrontText());
            challenge.setBackText(card.getBackText());
            challengeRepository.save(challenge);
        }

        whatsAppService.sendChallenge(user, settings);

        return ResponseEntity.ok(Map.of(
            "message", "Desafio enviado com sucesso!",
            "phone", phone,
            "status", "sent"
        ));
    }

    @GetMapping("/challenges")
    public ResponseEntity<List<Map<String, Object>>> getChallenges(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "20") int limit) {

        List<Map<String, Object>> challenges = challengeRepository.findAll().stream()
                .filter(c -> c.getUser().getId().equals(user.getId()))
                .sorted((a, b) -> {
                    LocalDateTime aTime = a.getAnsweredAt() != null ? a.getAnsweredAt() : a.getSentAt();
                    LocalDateTime bTime = b.getAnsweredAt() != null ? b.getAnsweredAt() : b.getSentAt();
                    return bTime.compareTo(aTime);
                })
                .limit(limit)
                .map(c -> Map.<String, Object>of(
                    "id", c.getId(),
                    "card", c.getCard().getFrontText(),
                    "status", c.getStatus(),
                    "answerType", c.getAnswerType(),
                    "sentAt", c.getSentAt(),
                    "answeredAt", c.getAnsweredAt()
                ))
                .toList();

        return ResponseEntity.ok(challenges);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats(@AuthenticationPrincipal User user) {
        List<WhatsAppChallenge> userChallenges = challengeRepository.findAll().stream()
                .filter(c -> c.getUser().getId().equals(user.getId()))
                .toList();

        long sent = userChallenges.stream().filter(c -> "sent".equals(c.getStatus())).count();
        long answered = userChallenges.stream().filter(c -> "answered".equals(c.getStatus())).count();
        long failed = userChallenges.stream().filter(c -> "failed".equals(c.getStatus())).count();

        long correct = userChallenges.stream().filter(c -> "right".equals(c.getAnswerType())).count();
        long wrong = userChallenges.stream().filter(c -> "wrong".equals(c.getAnswerType())).count();
        long unsure = userChallenges.stream().filter(c -> "unsure".equals(c.getAnswerType())).count();

        long accuracy = answered > 0 ? Math.round((correct * 100.0) / answered) : 0;

        return ResponseEntity.ok(Map.of(
            "totalChallenges", userChallenges.size(),
            "sent", sent,
            "answered", answered,
            "failed", failed,
            "correct", correct,
            "wrong", wrong,
            "unsure", unsure,
            "accuracy", accuracy + "%"
        ));
    }
}
