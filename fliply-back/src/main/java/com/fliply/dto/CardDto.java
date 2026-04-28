package com.fliply.dto;

import com.fliply.model.Card;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;

public class CardDto {

    @Data
    public static class Request {
        @NotBlank
        private String frontText;
        @NotBlank
        private String backText;
        private Integer position;
    }

    @Data
    public static class Response {
        private Long id;
        private Long deckId;
        private String frontText;
        private String backText;
        private Integer position;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public static Response from(Card c) {
            Response r = new Response();
            r.setId(c.getId());
            r.setDeckId(c.getDeck().getId());
            r.setFrontText(c.getFrontText());
            r.setBackText(c.getBackText());
            r.setPosition(c.getPosition());
            r.setCreatedAt(c.getCreatedAt());
            r.setUpdatedAt(c.getUpdatedAt());
            return r;
        }
    }
}
