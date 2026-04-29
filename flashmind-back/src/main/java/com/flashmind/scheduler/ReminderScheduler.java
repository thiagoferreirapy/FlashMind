package com.flashmind.scheduler;

import com.flashmind.model.Reminder;
import com.flashmind.repository.ReminderRepository;
import com.flashmind.service.FirebasePushService;
import com.flashmind.service.SseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class ReminderScheduler {

    private final ReminderRepository reminderRepository;
    private final SseService sseService;
    private final FirebasePushService pushService;

    @Scheduled(cron = "0 * * * * *")
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

            // SSE — notificação em tempo real para quem está com app aberto
            sseService.send(
                reminder.getUser().getId(),
                "reminder",
                Map.of(
                    "id",          reminder.getId(),
                    "title",       reminder.getTitle(),
                    "description", reminder.getDescription() != null ? reminder.getDescription() : ""
                )
            );

            // Push — notificação real para quem está com app fechado
            String channel = reminder.getChannel();
            if ("push".equals(channel) || "in_app".equals(channel)) {
                pushService.sendToUser(
                    reminder.getUser(),
                    reminder.getTitle(),
                    reminder.getDescription() != null ? reminder.getDescription() : "Hora de estudar! 📚",
                    Map.of("reminderId", String.valueOf(reminder.getId()), "type", "reminder")
                );
            }

            log.debug("Lembrete disparado: id={} usuário={}", reminder.getId(), reminder.getUser().getId());
        }
    }
}
