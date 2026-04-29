package com.flashmind.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

public class StudyDto {

    @Data
    public static class StartSessionRequest {
        @NotNull
        private Long deckId;
    }

    @Data
    public static class FinishSessionRequest {
        private Integer totalCards;
        private Integer rightCount;
        private Integer wrongCount;
        private Integer unsureCount;
    }

    @Data
    public static class AnswerRequest {
        @NotNull
        private Long cardId;
        @NotBlank
        private String answerType;
    }

    @Data
    public static class SessionResponse {
        private Long id;
        private Long deckId;
        private Integer totalCards;
        private Integer rightCount;
        private Integer wrongCount;
        private Integer unsureCount;
        private LocalDateTime startedAt;
        private LocalDateTime finishedAt;

        public static SessionResponse from(com.flashmind.model.StudySession s) {
            SessionResponse resp = new SessionResponse();
            resp.setId(s.getId());
            resp.setDeckId(s.getDeck().getId());
            resp.setTotalCards(s.getTotalCards());
            resp.setRightCount(s.getRightCount());
            resp.setWrongCount(s.getWrongCount());
            resp.setUnsureCount(s.getUnsureCount());
            resp.setStartedAt(s.getStartedAt());
            resp.setFinishedAt(s.getFinishedAt());
            return resp;
        }
    }
}


