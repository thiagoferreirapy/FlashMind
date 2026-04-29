package com.flashmind.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "whatsapp_challenges")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class WhatsAppChallenge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "card_id", nullable = false)
    private Card card;

    @Column(name = "phone", nullable = false, length = 25)
    private String phone;

    // snapshot do card no momento do envio
    @Column(name = "front_text", nullable = false, columnDefinition = "TEXT")
    private String frontText;

    @Column(name = "back_text", nullable = false, columnDefinition = "TEXT")
    private String backText;

    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private String status = "sent";

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "answered_at")
    private LocalDateTime answeredAt;

    @Column(name = "answer_type", length = 20)
    private String answerType;

    @Column(name = "ai_classification", length = 20)
    private String aiClassification;

    @Column(name = "provider_message_id", length = 100)
    private String providerMessageId;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() { this.updatedAt = LocalDateTime.now(); }
}
