package com.fliply.repository;

import com.fliply.model.WhatsAppChallenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface WhatsAppChallengeRepository extends JpaRepository<WhatsAppChallenge, Long> {

    @Query("SELECT c FROM WhatsAppChallenge c JOIN FETCH c.user JOIN FETCH c.card WHERE c.phone LIKE %:phone AND c.status = 'sent' ORDER BY c.sentAt DESC")
    List<WhatsAppChallenge> findLatestSentByPhone(String phone);

    @Query("SELECT c FROM WhatsAppChallenge c WHERE c.status = 'failed' AND c.sentAt IS NOT NULL ORDER BY c.sentAt ASC")
    List<WhatsAppChallenge> findFailedChallenges();

    @Query("SELECT c FROM WhatsAppChallenge c WHERE c.status = 'failed' AND c.sentAt > :since ORDER BY c.sentAt ASC")
    List<WhatsAppChallenge> findRecentFailedChallenges(LocalDateTime since);
}
