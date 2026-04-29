package com.flashmind.controller;

import com.flashmind.model.Card;
import com.flashmind.model.User;
import com.flashmind.model.WhatsAppChallenge;
import com.flashmind.repository.CardRepository;
import com.flashmind.repository.WhatsAppChallengeRepository;
import com.flashmind.service.WhatsAppService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/whatsapp")
@RequiredArgsConstructor
public class WhatsAppTestController {

    private final CardRepository cardRepository;
    private final WhatsAppChallengeRepository challengeRepository;
    private final WhatsAppService whatsAppService;

    @PostMapping("/test-send")
    public ResponseEntity<Map<String, Object>> testSend(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> body) {

        String phone = user.getWhatsappPhone();
        if (phone == null || phone.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Nenhum número WhatsApp vinculado ao perfil"));
        }

        Long cardId = Long.valueOf(body.get("cardId").toString());
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new IllegalArgumentException("Card não encontrado"));

        String normalizedPhone = phone.replaceAll("[^0-9]", "");

        WhatsAppChallenge challenge = WhatsAppChallenge.builder()
                .user(user)
                .card(card)
                .phone(normalizedPhone)
                .frontText(card.getFrontText())
                .backText(card.getBackText())
                .status("sent")
                .sentAt(LocalDateTime.now())
                .build();
        challengeRepository.save(challenge);

        String message = "🔥 *Bora treinar?*\n\n" + "Pergunta:\n" + card.getFrontText()
                + "\n\n✍️ Responde com suas palavras\r\n" + //
                "Depois eu te digo se acertou 😉";
        whatsAppService.sendMessage(normalizedPhone, message);

        return ResponseEntity.ok(Map.of(
                "message", "Desafio enviado!",
                "phone", normalizedPhone,
                "card", card.getFrontText()));
    }
}
