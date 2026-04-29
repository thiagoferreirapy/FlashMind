package com.flashmind.repository;

import com.flashmind.model.DeckShare;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DeckShareRepository extends JpaRepository<DeckShare, Long> {
    Optional<DeckShare> findByShareCode(String shareCode);
    Optional<DeckShare> findByShareSlug(String shareSlug);
    Optional<DeckShare> findByDeckId(Long deckId);
}
