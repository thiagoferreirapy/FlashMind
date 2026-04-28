package com.fliply.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "card_progress", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "card_id"})
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CardProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "card_id", nullable = false)
    private Card card;

    @Column(name = "right_count", nullable = false)
    @Builder.Default
    private Integer rightCount = 0;

    @Column(name = "wrong_count", nullable = false)
    @Builder.Default
    private Integer wrongCount = 0;

    @Column(name = "unsure_count", nullable = false)
    @Builder.Default
    private Integer unsureCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer streak = 0;

    @Column(name = "difficulty_score", nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal difficultyScore = BigDecimal.ONE;

    @Column(name = "review_after")
    private LocalDateTime reviewAfter;

    @Column(name = "last_review_at")
    private LocalDateTime lastReviewAt;

    @Column(name = "total_reviews", nullable = false)
    @Builder.Default
    private Integer totalReviews = 0;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "new";

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() { this.updatedAt = LocalDateTime.now(); }
}
