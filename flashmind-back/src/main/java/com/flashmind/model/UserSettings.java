package com.flashmind.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "user_settings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "daily_goal", nullable = false)
    @Builder.Default
    private Integer dailyGoal = 20;

    @Column(name = "session_size", nullable = false)
    @Builder.Default
    private Integer sessionSize = 10;

    @Column(name = "smart_order", nullable = false)
    @Builder.Default
    private Boolean smartOrder = true;

    @Column(name = "whatsapp_enabled", nullable = false)
    @Builder.Default
    private Boolean whatsappEnabled = false;

    @com.fasterxml.jackson.annotation.JsonProperty("whatsappPreferredTime")
    @Column(name = "whatsapp_time")
    private LocalTime whatsappTime;

    @Column(name = "whatsapp_deck_id")
    private Long whatsappDeckId;

    @Column(name = "notifications_enabled", nullable = false)
    @Builder.Default
    private Boolean notificationsEnabled = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() { this.updatedAt = LocalDateTime.now(); }
}
