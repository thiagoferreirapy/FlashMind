package com.flashmind.dto;

import com.flashmind.model.Deck;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

public class DeckDto {

    @Data
    public static class Request {
        @NotBlank @Size(max = 120)
        private String name;
        private String description;
        @Size(max = 20)
        private String icon;
        @Size(max = 30)
        private String color;
        private Boolean isPublic;
        private Boolean allowClone;
    }

    @Data
    public static class Response {
        private Long id;
        private Long userId;
        private String name;
        private String description;
        private String icon;
        private String color;
        private Boolean isPublic;
        private Boolean allowClone;
        private long cardCount;
        private long dueCount;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public static Response from(Deck d, long cardCount, long dueCount) {
            Response r = new Response();
            r.setId(d.getId());
            r.setUserId(d.getUser().getId());
            r.setName(d.getName());
            r.setDescription(d.getDescription());
            r.setIcon(d.getIcon());
            r.setColor(d.getColor());
            r.setIsPublic(d.getIsPublic());
            r.setAllowClone(d.getAllowClone());
            r.setCardCount(cardCount);
            r.setDueCount(dueCount);
            r.setCreatedAt(d.getCreatedAt());
            r.setUpdatedAt(d.getUpdatedAt());
            return r;
        }
    }
}
