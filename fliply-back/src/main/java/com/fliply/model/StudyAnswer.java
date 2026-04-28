package com.fliply.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "study_answers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StudyAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private StudySession session;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "card_id", nullable = false)
    private Card card;

    @Column(name = "answer_type", nullable = false, length = 20)
    private String answerType;

    @Column(name = "answered_at", nullable = false)
    @Builder.Default
    private LocalDateTime answeredAt = LocalDateTime.now();
}
