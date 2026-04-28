package com.fliply.service;

import com.fliply.dto.DeckDto;
import com.fliply.model.Deck;
import com.fliply.model.DeckShare;
import com.fliply.model.User;
import com.fliply.repository.CardProgressRepository;
import com.fliply.repository.CardRepository;
import com.fliply.repository.DeckRepository;
import com.fliply.repository.DeckShareRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeckService {

    private final DeckRepository deckRepository;
    private final CardRepository cardRepository;
    private final CardProgressRepository progressRepository;
    private final DeckShareRepository shareRepository;

    public List<DeckDto.Response> getUserDecks(User user) {
        return deckRepository.findByUserOrderByUpdatedAtDesc(user).stream()
            .map(d -> {
                long cardCount = cardRepository.countByDeck(d);
                long dueCount  = progressRepository.countDueCards(user, LocalDateTime.now());
                return DeckDto.Response.from(d, cardCount, dueCount);
            })
            .collect(Collectors.toList());
    }

    public DeckDto.Response getDeckById(Long id, User user) {
        Deck deck = deckRepository.findByIdAndUser(id, user)
            .orElseThrow(() -> new IllegalArgumentException("Deck não encontrado"));
        long cardCount = cardRepository.countByDeck(deck);
        long dueCount  = progressRepository.countDueCards(user, LocalDateTime.now());
        return DeckDto.Response.from(deck, cardCount, dueCount);
    }

    @Transactional
    public DeckDto.Response createDeck(DeckDto.Request request, User user) {
        Deck deck = Deck.builder()
            .user(user)
            .name(request.getName())
            .description(request.getDescription())
            .icon(request.getIcon() != null ? request.getIcon() : "📚")
            .color(request.getColor() != null ? request.getColor() : "#7C3AED")
            .isPublic(request.getIsPublic() != null ? request.getIsPublic() : false)
            .allowClone(request.getAllowClone() != null ? request.getAllowClone() : true)
            .build();
        deck = deckRepository.save(deck);
        return DeckDto.Response.from(deck, 0, 0);
    }

    @Transactional
    public DeckDto.Response updateDeck(Long id, DeckDto.Request request, User user) {
        Deck deck = deckRepository.findByIdAndUser(id, user)
            .orElseThrow(() -> new IllegalArgumentException("Deck não encontrado"));

        if (request.getName()        != null) deck.setName(request.getName());
        if (request.getDescription() != null) deck.setDescription(request.getDescription());
        if (request.getIcon()        != null) deck.setIcon(request.getIcon());
        if (request.getColor()       != null) deck.setColor(request.getColor());
        if (request.getIsPublic()    != null) deck.setIsPublic(request.getIsPublic());
        if (request.getAllowClone()  != null) deck.setAllowClone(request.getAllowClone());

        deck = deckRepository.save(deck);
        long cardCount = cardRepository.countByDeck(deck);
        return DeckDto.Response.from(deck, cardCount, 0);
    }

    @Transactional
    public void deleteDeck(Long id, User user) {
        Deck deck = deckRepository.findByIdAndUser(id, user)
            .orElseThrow(() -> new IllegalArgumentException("Deck não encontrado"));
        deckRepository.delete(deck);
    }

    @Transactional
    public DeckShare shareDeck(Long deckId, User user) {
        Deck deck = deckRepository.findByIdAndUser(deckId, user)
            .orElseThrow(() -> new IllegalArgumentException("Deck não encontrado"));

        return shareRepository.findByDeckId(deckId).orElseGet(() -> {
            DeckShare share = DeckShare.builder()
                .deck(deck)
                .owner(user)
                .shareCode(UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .isPublic(false)
                .allowClone(true)
                .build();
            return shareRepository.save(share);
        });
    }
}
