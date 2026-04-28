package com.fliply.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "study_sessions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StudySession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deck_id", nullable = false)
    private Deck deck;

    @Column(name = "total_cards", nullable = false)
    @Builder.Default
    private Integer totalCards = 0;

    @Column(name = "right_count", nullable = false)
    @Builder.Default
    private Integer rightCount = 0;

    @Column(name = "wrong_count", nullable = false)
    @Builder.Default
    private Integer wrongCount = 0;

    @Column(name = "unsure_count", nullable = false)
    @Builder.Default
    private Integer unsureCount = 0;

    @Column(name = "started_at", nullable = false)
    @Builder.Default
    private LocalDateTime startedAt = LocalDateTime.now();

    @Column(name = "finished_at")
    private LocalDateTime finishedAt;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<StudyAnswer> answers = new ArrayList<>();
}
