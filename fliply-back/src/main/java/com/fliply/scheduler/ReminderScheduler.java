package com.fliply.scheduler;

import com.fliply.model.Reminder;
import com.fliply.repository.ReminderRepository;
import com.fliply.service.SseService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class ReminderScheduler {

    private final ReminderRepository reminderRepository;
    private final SseService sseService;

    @Scheduled(cron = "0 * * * * *") // todo início de minuto
    @Transactional(readOnly = true)
    public void checkReminders() {
        LocalTime now = LocalTime.now().truncatedTo(ChronoUnit.MINUTES);
        DayOfWeek day = LocalDate.now().getDayOfWeek();
        boolean isWeekday = day != DayOfWeek.SATURDAY && day != DayOfWeek.SUNDAY;

        List<Reminder> candidates = reminderRepository.findActiveInAppRemindersWithUser();

        for (Reminder reminder : candidates) {
            LocalTime reminderTime = reminder.getTimeOfDay().truncatedTo(ChronoUnit.MINUTES);
            if (!reminderTime.equals(now)) continue;

            String freq = reminder.getFrequency();
            if ("weekdays".equals(freq) && !isWeekday) continue;
            if ("weekly".equals(freq) && day != DayOfWeek.MONDAY) continue;

            sseService.send(
                reminder.getUser().getId(),
                "reminder",
                Map.of(
                    "id",          reminder.getId(),
                    "title",       reminder.getTitle(),
                    "description", reminder.getDescription() != null ? reminder.getDescription() : ""
                )
            );
        }
    }
}
