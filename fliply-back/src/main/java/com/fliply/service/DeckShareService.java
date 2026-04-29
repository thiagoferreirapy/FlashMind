package com.fliply.service;

import com.fliply.dto.DeckShareDto;
import com.fliply.model.*;
import com.fliply.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class DeckShareService {

    private final DeckShareRepository deckShareRepository;
    private final DeckShareImportRepository importRepository;
    private final CardRepository cardRepository;
    private final DeckRepository deckRepository;

    @Transactional(readOnly = true)
    public DeckShareDto.PreviewWithCards getSharedDeckPreview(String code) {
        DeckShare share = deckShareRepository.findByShareCode(code)
                .orElseThrow(() -> new IllegalArgumentException("Código de compartilhamento inválido"));

        if (!share.getIsPublic()) {
            throw new IllegalArgumentException("Este deck não está público");
        }

        if (share.getExpiresAt() != null && share.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Este link de compartilhamento expirou");
        }

        List<Card> cards = cardRepository.findByDeckOrderByPosition(share.getDeck());
        log.info("Preview do deck compartilhado {} solicitado", code);

        return DeckShareDto.PreviewWithCards.from(share, cards);
    }

    @Transactional
    public DeckShareDto.ImportResponse importSharedDeck(String code, User user) {
        DeckShare share = deckShareRepository.findByShareCode(code)
                .orElseThrow(() -> new IllegalArgumentException("Código de compartilhamento inválido"));

        if (!share.getIsPublic()) {
            throw new IllegalArgumentException("Este deck não está público");
        }

        if (!share.getAllowClone()) {
            throw new IllegalArgumentException("Clonagem não permitida para este deck");
        }

        if (share.getExpiresAt() != null && share.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Este link de compartilhamento expirou");
        }

        Deck original = share.getDeck();
        List<Card> originalCards = cardRepository.findByDeckOrderByPosition(original);

        Deck cloned = Deck.builder()
                .user(user)
                .name(original.getName())
                .description(original.getDescription())
                .icon(original.getIcon())
                .color(original.getColor())
                .isPublic(false)
                .allowClone(true)
                .build();

        cloned = deckRepository.save(cloned);
        log.info("Novo deck {} criado como clone do {} pelo usuário {}", cloned.getId(), original.getId(), user.getId());

        int position = 0;
        for (Card originalCard : originalCards) {
            Card clonedCard = Card.builder()
                    .deck(cloned)
                    .frontText(originalCard.getFrontText())
                    .backText(originalCard.getBackText())
                    .position(position++)
                    .build();

            cardRepository.save(clonedCard);
        }

        DeckShareImport importRecord = DeckShareImport.builder()
                .share(share)
                .importedByUser(user)
                .clonedDeck(cloned)
                .build();

        importRepository.save(importRecord);
        log.info("Deck {} importado com sucesso. {} cards clonados", cloned.getId(), originalCards.size());

        return DeckShareDto.ImportResponse.from(cloned, originalCards.size());
    }

    public long countImports(Long shareId) {
        return importRepository.countByShareId(shareId);
    }
}
