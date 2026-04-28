package com.fliply.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "deck_share_imports")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DeckShareImport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deck_share_id", nullable = false)
    private DeckShare share;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "imported_by_user_id", nullable = false)
    private User importedByUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cloned_deck_id", nullable = false)
    private Deck clonedDeck;

    @Column(name = "imported_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime importedAt = LocalDateTime.now();
}
