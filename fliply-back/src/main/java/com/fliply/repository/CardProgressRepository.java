package com.fliply.repository;

import com.fliply.model.Card;
import com.fliply.model.CardProgress;
import com.fliply.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CardProgressRepository extends JpaRepository<CardProgress, Long> {
    Optional<CardProgress> findByUserAndCard(User user, Card card);
    List<CardProgress> findByUserAndCardDeckId(User user, Long deckId);

    @Query("SELECT cp FROM CardProgress cp WHERE cp.user = :user AND (cp.reviewAfter IS NULL OR cp.reviewAfter <= :now) ORDER BY cp.difficultyScore DESC")
    List<CardProgress> findDueCards(User user, LocalDateTime now);

    @Query("SELECT cp FROM CardProgress cp WHERE cp.user = :user ORDER BY cp.difficultyScore DESC")
    List<CardProgress> findHardestCards(User user, org.springframework.data.domain.Pageable pageable);

    @Query("SELECT cp FROM CardProgress cp WHERE cp.user = :user ORDER BY cp.difficultyScore ASC")
    List<CardProgress> findEasiestCards(User user, org.springframework.data.domain.Pageable pageable);

    @Query("SELECT COUNT(cp) FROM CardProgress cp WHERE cp.user = :user AND cp.reviewAfter <= :now")
    long countDueCards(User user, LocalDateTime now);

    @Query("SELECT cp FROM CardProgress cp JOIN FETCH cp.card c JOIN FETCH c.deck WHERE cp.user = :user AND cp.reviewAfter <= :until ORDER BY cp.reviewAfter ASC")
    List<CardProgress> findUpcomingDueCards(User user, LocalDateTime until, org.springframework.data.domain.Pageable pageable);

    @Query("SELECT SUM(cp.rightCount) FROM CardProgress cp WHERE cp.user = :user")
    Long sumRightCount(User user);

    @Query("SELECT SUM(cp.wrongCount) FROM CardProgress cp WHERE cp.user = :user")
    Long sumWrongCount(User user);

    @Query("SELECT SUM(cp.unsureCount) FROM CardProgress cp WHERE cp.user = :user")
    Long sumUnsureCount(User user);
}
