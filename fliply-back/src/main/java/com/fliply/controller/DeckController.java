package com.fliply.controller;

import com.fliply.dto.DeckDto;
import com.fliply.dto.DeckShareDto;
import com.fliply.model.DeckShare;
import com.fliply.model.User;
import com.fliply.service.DeckService;
import com.fliply.service.DeckShareService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/decks")
@RequiredArgsConstructor
public class DeckController {

    private final DeckService deckService;
    private final DeckShareService deckShareService;

    @GetMapping
    public ResponseEntity<List<DeckDto.Response>> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(deckService.getUserDecks(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeckDto.Response> getById(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(deckService.getDeckById(id, user));
    }

    @PostMapping
    public ResponseEntity<DeckDto.Response> create(
            @Valid @RequestBody DeckDto.Request request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(deckService.createDeck(request, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DeckDto.Response> update(
            @PathVariable Long id,
            @RequestBody DeckDto.Request request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(deckService.updateDeck(id, request, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal User user) {
        deckService.deleteDeck(id, user);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/share")
    public ResponseEntity<Map<String, Object>> share(@PathVariable Long id, @AuthenticationPrincipal User user) {
        DeckShare share = deckService.shareDeck(id, user);
        return ResponseEntity.ok(Map.of(
            "shareCode", share.getShareCode(),
            "isPublic",  share.getIsPublic()
        ));
    }

    @GetMapping("/share/{code}")
    public ResponseEntity<DeckShareDto.PreviewWithCards> getSharedDeck(@PathVariable String code) {
        return ResponseEntity.ok(deckShareService.getSharedDeckPreview(code));
    }

    @PostMapping("/share/{code}/import")
    public ResponseEntity<DeckShareDto.ImportResponse> importSharedDeck(
            @PathVariable String code,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(deckShareService.importSharedDeck(code, user));
    }
}
