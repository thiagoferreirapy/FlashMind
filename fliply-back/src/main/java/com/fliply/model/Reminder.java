package com.fliply.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "reminders")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Reminder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 300)
    private String description;

    @Column(nullable = false, length = 30)
    private String type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deck_id")
    private Deck deck;

    @Column(name = "time_of_day", nullable = false)
    private LocalTime timeOfDay;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String frequency = "daily";

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String channel = "push";

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "last_triggered_at")
    private LocalDateTime lastTriggeredAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() { this.updatedAt = LocalDateTime.now(); }
}
