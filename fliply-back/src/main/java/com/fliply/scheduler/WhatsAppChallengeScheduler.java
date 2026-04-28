package com.fliply.scheduler;

import com.fliply.model.UserSettings;
import com.fliply.repository.UserSettingsRepository;
import com.fliply.service.WhatsAppService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class WhatsAppChallengeScheduler {

    private final UserSettingsRepository settingsRepository;
    private final WhatsAppService whatsAppService;

    @Scheduled(cron = "0 * * * * *")
    public void sendScheduledChallenges() {
        LocalTime now = LocalTime.now().truncatedTo(ChronoUnit.MINUTES);
        List<UserSettings> active = settingsRepository.findActiveWhatsappSettings();

        for (UserSettings settings : active) {
            LocalTime configured = settings.getWhatsappTime().truncatedTo(ChronoUnit.MINUTES);
            if (!configured.equals(now)) continue;

            try {
                whatsAppService.sendChallenge(settings.getUser(), settings);
                log.info("Desafio WhatsApp enviado para usuário {}", settings.getUser().getId());
            } catch (Exception e) {
                log.error("Erro ao enviar desafio para usuário {}: {}", settings.getUser().getId(), e.getMessage());
            }
        }
    }

    @Scheduled(cron = "0 0,6,12,18 * * * *")
    public void retryFailedChallenges() {
        log.info("Iniciando retry de desafios falhados");
        try {
            whatsAppService.retryFailedChallenges();
            log.info("Retry de desafios concluído");
        } catch (Exception e) {
            log.error("Erro ao fazer retry de desafios: {}", e.getMessage(), e);
        }
    }
}
