package com.fliply.controller;

import com.fliply.dto.StudyDto;
import com.fliply.model.StudySession;
import com.fliply.model.User;
import com.fliply.repository.StudySessionRepository;
import com.fliply.service.StudyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/sessions", "/api/session"})
@RequiredArgsConstructor
public class StudyController {

    private final StudyService studyService;
    private final StudySessionRepository sessionRepository;

    @PostMapping
    public ResponseEntity<StudyDto.SessionResponse> startSession(
            @Valid @RequestBody StudyDto.StartSessionRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(studyService.startSession(request.getDeckId(), user));
    }

    @PutMapping("/{id}/finish")
    public ResponseEntity<StudyDto.SessionResponse> finishSession(
            @PathVariable Long id,
            @RequestBody StudyDto.FinishSessionRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(studyService.finishSession(id, request, user));
    }

    @PostMapping("/{id}/answers")
    public ResponseEntity<Map<String, String>> recordAnswer(
            @PathVariable Long id,
            @Valid @RequestBody StudyDto.AnswerRequest request,
            @AuthenticationPrincipal User user) {
        studyService.recordAnswer(id, request, user);
        return ResponseEntity.ok(Map.of("status", "ok"));
    }

    @GetMapping
    public ResponseEntity<List<StudyDto.SessionResponse>> getSessions(
            @RequestParam(defaultValue = "10") int limit,
            @AuthenticationPrincipal User user) {
        List<StudyDto.SessionResponse> sessions = sessionRepository.findByUserOrderByStartedAtDesc(user, PageRequest.of(0, limit))
                .stream()
                .map(StudyDto.SessionResponse::from)
                .toList();
        return ResponseEntity.ok(sessions);
    }
}
