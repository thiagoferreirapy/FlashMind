package com.fliply.repository;

import com.fliply.model.StudySession;
import com.fliply.model.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface StudySessionRepository extends JpaRepository<StudySession, Long> {
    List<StudySession> findByUserOrderByStartedAtDesc(User user, Pageable pageable);

    @Query("SELECT COUNT(s) FROM StudySession s WHERE s.user = :user AND s.startedAt >= :since")
    long countSessionsSince(User user, LocalDateTime since);

    @Query("SELECT SUM(s.totalCards) FROM StudySession s WHERE s.user = :user AND s.startedAt >= :since")
    Long sumCardsStudiedSince(User user, LocalDateTime since);

    @Query("SELECT COUNT(s) FROM StudySession s WHERE s.user = :user AND s.startedAt >= :start AND s.startedAt < :end")
    long countSessionsBetween(User user, LocalDateTime start, LocalDateTime end);

    @Query("SELECT COUNT(DISTINCT DATE(s.startedAt)) FROM StudySession s WHERE s.user = :user AND s.startedAt >= :since")
    long countDistinctStudyDays(User user, LocalDateTime since);

    @Query("SELECT SUM(s.rightCount) FROM StudySession s WHERE s.user = :user AND s.startedAt >= :since")
    Long sumRightCountSince(User user, LocalDateTime since);

    @Query("SELECT SUM(s.wrongCount) FROM StudySession s WHERE s.user = :user AND s.startedAt >= :since")
    Long sumWrongCountSince(User user, LocalDateTime since);
}
