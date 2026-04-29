package com.flashmind.service;

import com.flashmind.dto.StudyDto;
import com.flashmind.model.*;
import com.flashmind.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class StudyService {

    private final StudySessionRepository sessionRepository;
    private final CardRepository cardRepository;
    private final CardProgressRepository progressRepository;
    private final DeckRepository deckRepository;

    @Transactional
    public StudyDto.SessionResponse startSession(Long deckId, User user) {
        Deck deck = deckRepository.findByIdAndUser(deckId, user)
            .orElseThrow(() -> new IllegalArgumentException("Deck não encontrado"));

        StudySession session = StudySession.builder()
            .user(user)
            .deck(deck)
            .build();
        return StudyDto.SessionResponse.from(sessionRepository.save(session));
    }

    @Transactional
    public StudyDto.SessionResponse finishSession(Long sessionId, StudyDto.FinishSessionRequest request, User user) {
        StudySession session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new IllegalArgumentException("Sessão não encontrada"));

        if (!session.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Acesso negado");
        }

        session.setFinishedAt(LocalDateTime.now());
        if (request.getTotalCards()  != null) session.setTotalCards(request.getTotalCards());
        if (request.getRightCount()  != null) session.setRightCount(request.getRightCount());
        if (request.getWrongCount()  != null) session.setWrongCount(request.getWrongCount());
        if (request.getUnsureCount() != null) session.setUnsureCount(request.getUnsureCount());
        return StudyDto.SessionResponse.from(sessionRepository.save(session));
    }

    @Transactional
    public void recordAnswer(Long sessionId, StudyDto.AnswerRequest request, User user) {
        StudySession session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new IllegalArgumentException("Sessão não encontrada"));
        Card card = cardRepository.findById(request.getCardId())
            .orElseThrow(() -> new IllegalArgumentException("Card não encontrado"));

        StudyAnswer answer = StudyAnswer.builder()
            .session(session)
            .card(card)
            .answerType(request.getAnswerType())
            .build();
        session.getAnswers().add(answer);

        CardProgress progress = progressRepository.findByUserAndCard(user, card)
            .orElseGet(() -> CardProgress.builder().user(user).card(card).build());

        applySpacedRepetition(progress, request.getAnswerType());
        progressRepository.save(progress);
        sessionRepository.save(session);
    }

    private void applySpacedRepetition(CardProgress p, String answerType) {
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
    }
}
