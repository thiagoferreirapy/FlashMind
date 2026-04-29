package com.flashmind.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.flashmind.model.*;
import com.flashmind.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class WhatsAppService {

    @Value("${uazap.url}")
    private String uazapUrl;

    @Value("${uazap.token}")
    private String uazapToken;

    private final WhatsAppChallengeRepository challengeRepository;
    private final UserSettingsRepository settingsRepository;
    private final CardRepository cardRepository;
    private final CardProgressRepository progressRepository;
    private final DeckRepository deckRepository;
    private final GeminiService geminiService;

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public void sendChallenge(User user, UserSettings settings) {
        if (!isConfigured()) {
            log.warn("WhatsApp não configurado - token ou URL faltando");
            return;
        }

        String phone = user.getWhatsappPhone();
        if (phone == null || phone.isBlank()) {
            log.debug("Usuário {} sem número WhatsApp vinculado", user.getId());
            return;
        }

        Card card = pickCard(user, settings);
        if (card == null) {
            log.warn("Usuário {} - nenhum card disponível para desafio", user.getId());
            sendMessage(normalizePhone(phone), "Nenhum card disponível no momento. Estude no FlashMind para gerar novos desafios! 📖");
            return;
        }

        String normalizedPhone = normalizePhone(phone);
        WhatsAppChallenge challenge = WhatsAppChallenge.builder()
                .user(user)
                .card(card)
                .phone(normalizedPhone)
                .frontText(card.getFrontText())
                .backText(card.getBackText())
                .status("queued")
                .build();

        challenge = challengeRepository.save(challenge);
        log.info("Desafio {} criado para usuário {} telefone {}", challenge.getId(), user.getId(), normalizedPhone);

        String message = formatChallengeMessage(card);
        boolean sent = sendMessage(normalizedPhone, message);

        if (sent) {
            challenge.setStatus("sent");
            challenge.setSentAt(LocalDateTime.now());
            log.info("Desafio {} enviado com sucesso", challenge.getId());
        } else {
            challenge.setStatus("failed");
            log.error("Falha ao enviar desafio {} para telefone {}", challenge.getId(), normalizedPhone);
        }

        challengeRepository.save(challenge);
    }

    @Transactional
    public void processWebhookAnswer(String phone, String userAnswer) {
        String normalizedPhone = normalizePhone(phone);
        log.info("Processando resposta para o número: {}", normalizedPhone);

        List<WhatsAppChallenge> results = challengeRepository.findLatestSentByPhone(normalizedPhone);

        if (results.isEmpty() && normalizedPhone.startsWith("55")) {
            String shortPhone = normalizedPhone.substring(2);
            log.info("Desafio não encontrado com 55, tentando com: {}", shortPhone);
            results = challengeRepository.findLatestSentByPhone(shortPhone);
        }

        if (results.isEmpty() && normalizedPhone.length() >= 8) {
            String last8 = normalizedPhone.substring(normalizedPhone.length() - 8);
            log.info("Tentando busca flexível pelos últimos 8 dígitos: {}", last8);
            results = challengeRepository.findLatestSentByPhone(last8);
        }

        if (results.isEmpty()) {
            log.info("Nenhum desafio pendente para o número {}", normalizedPhone);
            sendMessage(normalizedPhone, "Nenhum desafio pendente. Abra o FlashMind para estudar! 📖");
            return;
        }

        WhatsAppChallenge challenge = results.get(0);

        // Fix 1 — marca como "answered" imediatamente para evitar processamento duplicado
        challenge.setStatus("answered");
        challenge.setAnsweredAt(LocalDateTime.now());
        challengeRepository.save(challenge);

        User user = challenge.getUser();
        Card card = challenge.getCard();

        String answerType;
        try {
            answerType = geminiService.evaluate(challenge.getFrontText(), challenge.getBackText(), userAnswer);
            log.info("Avaliação da IA para a resposta '{}': {}", userAnswer, answerType);
        } catch (Exception e) {
            // Fix 4 — Gemini falhou: não penaliza o usuário
            log.error("Erro ao avaliar com Gemini: {}", e.getMessage());
            challenge.setStatus("eval_failed");
            challengeRepository.save(challenge);
            sendMessage(normalizedPhone, "⚠️ Não consegui avaliar sua resposta agora. Tente responder novamente em instantes.");
            return;
        }

        challenge.setAnswerType(answerType);
        challenge.setAiClassification(answerType);
        challengeRepository.save(challenge);

        applySpacedRepetition(user, card, answerType);

        String emoji = switch (answerType) {
            case "right" -> "✅ *Correto!*";
            case "unsure" -> "🤔 *Quase!*";
            default -> "❌ *Errado!*";
        };

        String reply = emoji + "\n\n*Resposta correta:*\n" + card.getBackText();
        sendMessage(normalizedPhone, reply);
    }

    public boolean sendMessage(String phone, String message) {
        try {
            if (!isConfigured()) {
                log.warn("WhatsApp não configurado - impossível enviar mensagem");
                return false;
            }

            if (phone == null || phone.isBlank()) {
                log.warn("Número de telefone inválido");
                return false;
            }

            if (message == null || message.isBlank()) {
                log.warn("Mensagem vazia");
                return false;
            }

            Map<String, String> payload = new HashMap<>();
            payload.put("number", phone);
            payload.put("text", message);

            String body = objectMapper.writeValueAsString(payload);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(uazapUrl))
                    .header("Content-Type", "application/json")
                    .header("token", uazapToken)
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .timeout(java.time.Duration.ofSeconds(10))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("Mensagem enviada com sucesso [{}]: {}", response.statusCode(), response.body());
                return true;
            } else {
                log.error("Falha ao enviar mensagem [{}]: {}", response.statusCode(), response.body());
                return false;
            }
        } catch (java.net.http.HttpTimeoutException e) {
            log.error("Timeout ao enviar mensagem para {}: {}", phone, e.getMessage());
            return false;
        } catch (Exception e) {
            log.error("Erro ao enviar mensagem para {}: {}", phone, e.getMessage(), e);
            return false;
        }
    }

    private Card pickCard(User user, UserSettings settings) {
        LocalDateTime now = LocalDateTime.now();

        if (settings.getWhatsappDeckId() != null) {
            return pickCardFromDeck(user, settings.getWhatsappDeckId(), now);
        }

        return pickCardFromAllDecks(user, now);
    }

    private Card pickCardFromDeck(User user, Long deckId, LocalDateTime now) {
        Deck deck = deckRepository.findById(deckId).orElse(null);
        // Fix 3 — verifica se o deck existe e pertence ao usuário
        if (deck == null || !deck.getUser().getId().equals(user.getId())) {
            log.warn("Deck {} não encontrado ou não pertence ao usuário {}", deckId, user.getId());
            return pickCardFromAllDecks(user, now);
        }

        List<Card> deckCards = cardRepository.findByDeckOrderByPosition(deck);
        if (deckCards.isEmpty()) {
            log.warn("Nenhum card no deck {} do usuário {}", deckId, user.getId());
            return null;
        }

        List<CardProgress> dueInDeck = progressRepository.findDueCards(user, now)
                .stream()
                .filter(cp -> cp.getCard().getDeck().getId().equals(deckId))
                .sorted((a, b) -> b.getDifficultyScore().compareTo(a.getDifficultyScore()))
                .collect(Collectors.toList());

        if (!dueInDeck.isEmpty()) {
            log.debug("Selecionado card em atraso do deck {}", deckId);
            return dueInDeck.get(0).getCard();
        }

        Card random = deckCards.get((int) (Math.random() * deckCards.size()));
        log.debug("Selecionado card aleatório do deck {}", deckId);
        return random;
    }

    private Card pickCardFromAllDecks(User user, LocalDateTime now) {
        List<CardProgress> allDue = progressRepository.findDueCards(user, now);

        if (!allDue.isEmpty()) {
            CardProgress selected = allDue.stream()
                    .max((a, b) -> {
                        int diffCmp = b.getDifficultyScore().compareTo(a.getDifficultyScore());
                        if (diffCmp != 0) return diffCmp;
                        long aWait = java.time.temporal.ChronoUnit.HOURS.between(a.getReviewAfter(), now);
                        long bWait = java.time.temporal.ChronoUnit.HOURS.between(b.getReviewAfter(), now);
                        return Long.compare(bWait, aWait);
                    })
                    .orElse(allDue.get(0));

            log.debug("Selecionado card em atraso com dificuldade: {}", selected.getDifficultyScore());
            return selected.getCard();
        }

        List<Deck> decks = deckRepository.findByUserOrderByUpdatedAtDesc(user);
        for (Deck deck : decks) {
            List<Card> cards = cardRepository.findByDeckOrderByPosition(deck);
            if (!cards.isEmpty()) {
                Card random = cards.get((int) (Math.random() * cards.size()));
                log.debug("Nenhum card em atraso, selecionado aleatório do deck {}", deck.getId());
                return random;
            }
        }

        log.warn("Usuário {} sem cards disponíveis", user.getId());
        return null;
    }

    private void applySpacedRepetition(User user, Card card, String answerType) {
        CardProgress p = progressRepository.findByUserAndCard(user, card)
                .orElseGet(() -> CardProgress.builder().user(user).card(card).build());

        p.setTotalReviews(p.getTotalReviews() + 1);
        p.setLastReviewAt(LocalDateTime.now());
        double difficulty = p.getDifficultyScore().doubleValue();
        int streak = p.getStreak();
        long intervalHours;

        switch (answerType) {
            case "wrong" -> {
                p.setWrongCount(p.getWrongCount() + 1);
                streak = 0;
                difficulty = Math.min(difficulty + 0.3, 3.0);
                intervalHours = 1;
                p.setStatus("learning");
            }
            case "unsure" -> {
                p.setUnsureCount(p.getUnsureCount() + 1);
                streak = Math.max(0, streak - 1);
                difficulty = Math.min(difficulty + 0.1, 3.0);
                intervalHours = Math.max(12, streak * 12L);
                p.setStatus("learning");
            }
            default -> {
                p.setRightCount(p.getRightCount() + 1);
                streak++;
                difficulty = Math.max(0.3, difficulty - 0.1);
                intervalHours = switch (streak) {
                    case 1 -> 24;
                    case 2 -> 72;
                    case 3 -> 168;
                    default -> Math.round((streak - 1) * 60 / difficulty);
                };
                p.setStatus(streak >= 5 ? "mastered" : "learning");
            }
        }

        p.setStreak(streak);
        p.setDifficultyScore(BigDecimal.valueOf(Math.round(difficulty * 100.0) / 100.0));
        p.setReviewAfter(LocalDateTime.now().plusHours(intervalHours));
        progressRepository.save(p);
    }

    private String normalizePhone(String phone) {
        return phone.replaceAll("[^0-9]", "");
    }

    private boolean isConfigured() {
        return uazapUrl != null && !uazapUrl.isBlank() &&
               uazapToken != null && !uazapToken.isBlank();
    }

    private String formatChallengeMessage(Card card) {
        String front = card.getFrontText();
        if (front.length() > 200) {
            front = front.substring(0, 197) + "...";
        }
        return String.format(
            "🔥 *Bora treinar?*\n\n" +
            "*Pergunta:*\n%s\n\n" +
            "✍️ Responde com suas palavras\n" +
            "Depois eu te digo se acertou 😉",
            front
        );
    }

    @Transactional
    public void retryFailedChallenges() {
        LocalDateTime since = LocalDateTime.now().minusHours(24);
        List<WhatsAppChallenge> failed = challengeRepository.findRecentFailedChallenges(since);

        int retried = 0;
        int succeeded = 0;

        for (WhatsAppChallenge challenge : failed) {
            retried++;
            log.info("Retry desafio {}/{} para {}", retried, failed.size(), challenge.getPhone());

            // Fix 5 — card pode ter sido deletado após o desafio ser criado
            if (challenge.getCard() == null) {
                log.warn("Card do desafio {} foi deletado, pulando retry", challenge.getId());
                continue;
            }

            String message = formatChallengeMessage(challenge.getCard());
            boolean sent = sendMessage(challenge.getPhone(), message);

            if (sent) {
                challenge.setStatus("sent");
                challenge.setSentAt(LocalDateTime.now());
                succeeded++;
                log.info("Desafio {} reenviado com sucesso", challenge.getId());
            } else {
                log.warn("Retry falhou para desafio {}", challenge.getId());
            }

            challengeRepository.save(challenge);
        }

        log.info("Retry de desafios concluído: {}/{} sucesso", succeeded, retried);
    }
}
