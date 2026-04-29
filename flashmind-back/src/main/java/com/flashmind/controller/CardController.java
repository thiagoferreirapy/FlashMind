package com.flashmind.controller;

import com.flashmind.dto.CardDto;
import com.flashmind.model.Card;
import com.flashmind.model.CardProgress;
import com.flashmind.model.Deck;
import com.flashmind.model.User;
import com.flashmind.repository.CardProgressRepository;
import com.flashmind.repository.CardRepository;
import com.flashmind.repository.DeckRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class CardController {

    private final CardRepository cardRepository;
    private final DeckRepository deckRepository;
    private final CardProgressRepository progressRepository;

    @GetMapping("/api/decks/{deckId}/cards")
    public ResponseEntity<List<CardDto.Response>> getCards(
            @PathVariable Long deckId,
            @AuthenticationPrincipal User user) {
        Deck deck = deckRepository.findByIdAndUser(deckId, user)
            .orElseThrow(() -> new IllegalArgumentException("Deck não encontrado"));
        List<CardDto.Response> cards = cardRepository.findByDeckOrderByPosition(deck)
            .stream().map(CardDto.Response::from).collect(Collectors.toList());
        return ResponseEntity.ok(cards);
    }

    @PostMapping("/api/decks/{deckId}/cards")
    public ResponseEntity<CardDto.Response> createCard(
            @PathVariable Long deckId,
            @Valid @RequestBody CardDto.Request request,
            @AuthenticationPrincipal User user) {
        Deck deck = deckRepository.findByIdAndUser(deckId, user)
            .orElseThrow(() -> new IllegalArgumentException("Deck não encontrado"));
        long pos = cardRepository.countByDeck(deck);
        Card card = Card.builder()
            .deck(deck)
            .frontText(request.getFrontText())
            .backText(request.getBackText())
            .position(request.getPosition() != null ? request.getPosition() : (int) pos)
            .build();
        return ResponseEntity.ok(CardDto.Response.from(cardRepository.save(card)));
    }

    @PutMapping("/api/cards/{id}")
    public ResponseEntity<CardDto.Response> updateCard(
            @PathVariable Long id,
            @RequestBody CardDto.Request request,
            @AuthenticationPrincipal User user) {
        Card card = cardRepository.findById(id)
            .filter(c -> c.getDeck().getUser().getId().equals(user.getId()))
            .orElseThrow(() -> new IllegalArgumentException("Card não encontrado"));
        if (request.getFrontText() != null) card.setFrontText(request.getFrontText());
        if (request.getBackText()  != null) card.setBackText(request.getBackText());
        return ResponseEntity.ok(CardDto.Response.from(cardRepository.save(card)));
    }

    @DeleteMapping("/api/cards/{id}")
    public ResponseEntity<Void> deleteCard(@PathVariable Long id, @AuthenticationPrincipal User user) {
        Card card = cardRepository.findById(id)
            .filter(c -> c.getDeck().getUser().getId().equals(user.getId()))
            .orElseThrow(() -> new IllegalArgumentException("Card não encontrado"));
        cardRepository.delete(card);
        return ResponseEntity.noContent().build();
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    @GetMapping("/api/decks/{deckId}/progress")
    public ResponseEntity<List<CardProgress>> getProgress(
            @PathVariable Long deckId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(progressRepository.findByUserAndCardDeckId(user, deckId));
    }
}
