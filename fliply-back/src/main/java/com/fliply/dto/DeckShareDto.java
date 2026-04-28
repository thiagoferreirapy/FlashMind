package com.fliply.dto;

import com.fliply.model.Card;
import com.fliply.model.Deck;
import com.fliply.model.DeckShare;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

public class DeckShareDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Preview {
        private String shareCode;
        private String deckName;
        private String deckDescription;
        private String deckIcon;
        private String deckColor;
        private Integer cardCount;
        private String ownerName;
        private Boolean allowClone;
        private Boolean isExpired;

        public static Preview from(DeckShare share, int cardCount) {
            boolean expired = share.getExpiresAt() != null && share.getExpiresAt().isBefore(LocalDateTime.now());

            return Preview.builder()
                    .shareCode(share.getShareCode())
                    .deckName(share.getDeck().getName())
                    .deckDescription(share.getDeck().getDescription())
                    .deckIcon(share.getDeck().getIcon())
                    .deckColor(share.getDeck().getColor())
                    .cardCount(cardCount)
                    .ownerName(share.getOwner().getName())
                    .allowClone(share.getAllowClone())
                    .isExpired(expired)
                    .build();
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ImportRequest {
        private String shareCode;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ImportResponse {
        private Long deckId;
        private String deckName;
        private Integer cardCount;
        private String message;

        public static ImportResponse from(Deck deck, int cardCount) {
            return ImportResponse.builder()
                    .deckId(deck.getId())
                    .deckName(deck.getName())
                    .cardCount(cardCount)
                    .message("Deck importado com sucesso!")
                    .build();
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CardPreview {
        private Long id;
        private String front;
        private String back;

        public static CardPreview from(Card card) {
            return CardPreview.builder()
                    .id(card.getId())
                    .front(card.getFrontText())
                    .back(card.getBackText())
                    .build();
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PreviewWithCards {
        private String shareCode;
        private String deckName;
        private String deckDescription;
        private String deckIcon;
        private String deckColor;
        private String ownerName;
        private Boolean allowClone;
        private Boolean isExpired;
        private List<CardPreview> cards;
        private Integer cardCount;

        public static PreviewWithCards from(DeckShare share, List<Card> cards) {
            boolean expired = share.getExpiresAt() != null && share.getExpiresAt().isBefore(LocalDateTime.now());

            return PreviewWithCards.builder()
                    .shareCode(share.getShareCode())
                    .deckName(share.getDeck().getName())
                    .deckDescription(share.getDeck().getDescription())
                    .deckIcon(share.getDeck().getIcon())
                    .deckColor(share.getDeck().getColor())
                    .ownerName(share.getOwner().getName())
                    .allowClone(share.getAllowClone())
                    .isExpired(expired)
                    .cards(cards.stream().map(CardPreview::from).toList())
                    .cardCount(cards.size())
                    .build();
        }
    }
}
