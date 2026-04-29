package com.flashmind.repository;

import com.flashmind.model.Card;
import com.flashmind.model.Deck;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CardRepository extends JpaRepository<Card, Long> {
    List<Card> findByDeckOrderByPosition(Deck deck);
    Optional<Card> findByIdAndDeckId(Long id, Long deckId);
    long countByDeck(Deck deck);
}
