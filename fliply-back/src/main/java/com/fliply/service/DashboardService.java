package com.fliply.service;

import com.fliply.model.User;
import com.fliply.repository.CardProgressRepository;
import com.fliply.repository.StudySessionRepository;
import com.fliply.repository.UserSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final CardProgressRepository progressRepository;
    private final StudySessionRepository sessionRepository;
    private final UserSettingsRepository settingsRepository;

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public Map<String, Object> getSummary(User user) {
        LocalDateTime today = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);

        Long studiedToday = sessionRepository.sumCardsStudiedSince(user, today);
        Long rightToday   = sessionRepository.sumRightCountSince(user, today);
        Long wrongToday   = sessionRepository.sumWrongCountSince(user, today);
        long dueCount = progressRepository.countDueCards(user, LocalDateTime.now());

        Long totalRight  = progressRepository.sumRightCount(user);
        Long totalWrong  = progressRepository.sumWrongCount(user);
        Long totalUnsure = progressRepository.sumUnsureCount(user);
        long totalStudied = (totalRight != null ? totalRight : 0)
                          + (totalWrong != null ? totalWrong : 0)
                          + (totalUnsure != null ? totalUnsure : 0);

        int accuracy = 0;
        if (totalStudied > 0 && totalRight != null) {
            accuracy = (int) Math.round((totalRight * 100.0) / totalStudied);
        }

        long streak = calculateStreak(user);

        Map<String, Object> result = new HashMap<>();
        result.put("studiedToday", studiedToday != null ? studiedToday : 0);
        result.put("rightToday",   rightToday  != null ? rightToday  : 0);
        result.put("wrongToday",   wrongToday  != null ? wrongToday  : 0);
        result.put("dueCount",     dueCount);
        result.put("totalStudied", totalStudied);
        result.put("accuracy",     accuracy);
        result.put("streak",       streak);
        int dailyGoal = settingsRepository.findByUser(user).map(s -> s.getDailyGoal()).orElse(20);
        result.put("dailyGoal",    dailyGoal);
        return result;
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public Map<String, Object> getFullDashboard(User user) {
        var summary = getSummary(user);

        var hardest = progressRepository.findHardestCards(user, PageRequest.of(0, 5))
            .stream().map(cp -> {
                Map<String, Object> m = new HashMap<>();
                m.put("frontText",       cp.getCard().getFrontText());
                m.put("wrongCount",      cp.getWrongCount());
                m.put("difficultyScore", cp.getDifficultyScore());
                return m;
            }).collect(Collectors.toList());

        var easiest = progressRepository.findEasiestCards(user, PageRequest.of(0, 5))
            .stream().map(cp -> {
                Map<String, Object> m = new HashMap<>();
                m.put("frontText",  cp.getCard().getFrontText());
                m.put("rightCount", cp.getRightCount());
                m.put("streak",     cp.getStreak());
                return m;
            }).collect(Collectors.toList());

        var recentSessions = sessionRepository.findByUserOrderByStartedAtDesc(user, PageRequest.of(0, 5))
            .stream().map(s -> {
                Map<String, Object> m = new HashMap<>();
                m.put("deckName",   s.getDeck().getName());
                m.put("totalCards", s.getTotalCards());
                m.put("rightCount", s.getRightCount());
                m.put("startedAt",  s.getStartedAt());
                return m;
            }).collect(Collectors.toList());

        LocalDateTime now    = LocalDateTime.now();
        LocalDateTime inDays = now.plusDays(3);
        var dueCards = progressRepository.findUpcomingDueCards(user, inDays, PageRequest.of(0, 8))
            .stream().map(cp -> {
                Map<String, Object> m = new HashMap<>();
                m.put("frontText",   cp.getCard().getFrontText());
                m.put("deckName",    cp.getCard().getDeck().getName());
                m.put("reviewAfter", cp.getReviewAfter());
                m.put("overdue",     cp.getReviewAfter() != null && cp.getReviewAfter().isBefore(now));
                return m;
            }).collect(Collectors.toList());

        Long totalRight  = progressRepository.sumRightCount(user);
        Long totalWrong  = progressRepository.sumWrongCount(user);
        Long totalUnsure = progressRepository.sumUnsureCount(user);

        summary.put("hardestCards",    hardest);
        summary.put("easiestCards",    easiest);
        summary.put("dueCards",        dueCards);
        summary.put("recentActivity",  recentSessions);
        summary.put("totalRight",      totalRight  != null ? totalRight  : 0);
        summary.put("totalWrong",      totalWrong  != null ? totalWrong  : 0);
        summary.put("totalUnsure",     totalUnsure != null ? totalUnsure : 0);
        summary.put("totalSessions",   sessionRepository.countSessionsSince(user, LocalDateTime.now().minusYears(10)));
        return summary;
    }

    private long calculateStreak(User user) {
        long days = 0;
        // Start from today (beginning of the day)
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        
        for (int i = 0; i < 365; i++) {
            LocalDateTime dayStart = startOfDay.minusDays(i);
            LocalDateTime dayEnd = dayStart.plusDays(1);
            
            // Count sessions specifically within this 24-hour window
            long count = sessionRepository.countSessionsBetween(user, dayStart, dayEnd);
            
            if (count > 0) {
                days++;
            } else {
                // If we miss a day, the streak ends (unless it's today and we haven't studied yet)
                if (i > 0) break;
            }
        }
        return days;
    }
}
