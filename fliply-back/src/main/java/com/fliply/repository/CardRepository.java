package com.fliply.repository;

import com.fliply.model.Card;
import com.fliply.model.Deck;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CardRepository extends JpaRepository<Card, Long> {
    List<Card> findByDeckOrderByPosition(Deck deck);
    Optional<Card> findByIdAndDeckId(Long id, Long deckId);
    long countByDeck(Deck deck);
}
