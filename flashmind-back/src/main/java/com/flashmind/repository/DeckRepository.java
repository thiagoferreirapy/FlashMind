package com.flashmind.repository;

import com.flashmind.model.Deck;
import com.flashmind.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface DeckRepository extends JpaRepository<Deck, Long> {
    List<Deck> findByUserOrderByUpdatedAtDesc(User user);
    Optional<Deck> findByIdAndUser(Long id, User user);

    @Query("SELECT COUNT(c) FROM Card c WHERE c.deck.id = :deckId")
    long countCardsByDeckId(Long deckId);
}
