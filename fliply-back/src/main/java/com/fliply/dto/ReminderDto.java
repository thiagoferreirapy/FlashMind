package com.fliply.dto;

import com.fliply.model.Reminder;
import lombok.Data;

import java.time.LocalDateTime;
import java.time.LocalTime;

public class ReminderDto {

    @Data
    public static class Response {
        private Long id;
        private String title;
        private String description;
        private String type;
        private Long deckId;
        private LocalTime timeOfDay;
        private String frequency;
        private String channel;
        private Boolean isActive;
        private LocalDateTime lastTriggeredAt;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public static Response from(Reminder r) {
            Response dto = new Response();
            dto.setId(r.getId());
            dto.setTitle(r.getTitle());
            dto.setDescription(r.getDescription());
            dto.setType(r.getType());
            dto.setDeckId(r.getDeck() != null ? r.getDeck().getId() : null);
            dto.setTimeOfDay(r.getTimeOfDay());
            dto.setFrequency(r.getFrequency());
            dto.setChannel(r.getChannel());
            dto.setIsActive(r.getIsActive());
            dto.setLastTriggeredAt(r.getLastTriggeredAt());
            dto.setCreatedAt(r.getCreatedAt());
            dto.setUpdatedAt(r.getUpdatedAt());
            return dto;
        }
    }
}
