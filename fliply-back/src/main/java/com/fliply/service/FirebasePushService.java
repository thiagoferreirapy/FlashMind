package com.fliply.service;

import com.fliply.model.DeviceToken;
import com.fliply.model.User;
import com.fliply.repository.DeviceTokenRepository;
import com.google.firebase.FirebaseApp;
import com.google.firebase.messaging.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class FirebasePushService {

    private final DeviceTokenRepository deviceTokenRepository;

    public boolean isAvailable() {
        return !FirebaseApp.getApps().isEmpty();
    }

    @Transactional
    public void sendToUser(User user, String title, String body) {
        sendToUser(user, title, body, null);
    }

    @Transactional
    public void sendToUser(User user, String title, String body, Map<String, String> data) {
        if (!isAvailable()) {
            log.debug("Firebase não disponível, pulando push para usuário {}", user.getId());
            return;
        }

        List<DeviceToken> tokens = deviceTokenRepository.findActiveByUser(user);
        if (tokens.isEmpty()) {
            log.debug("Usuário {} sem device tokens registrados", user.getId());
            return;
        }

        int success = 0;
        int failed = 0;

        for (DeviceToken deviceToken : tokens) {
            boolean sent = sendToToken(deviceToken.getToken(), title, body, data);
            if (sent) {
                deviceToken.setLastUsedAt(LocalDateTime.now());
                deviceTokenRepository.save(deviceToken);
                success++;
            } else {
                deviceToken.setActive(false);
                deviceTokenRepository.save(deviceToken);
                failed++;
            }
        }

        log.info("Push para usuário {}: {}/{} enviados", user.getId(), success, tokens.size());
    }

    public boolean sendToToken(String fcmToken, String title, String body, Map<String, String> data) {
        try {
            Notification notification = Notification.builder()
                    .setTitle(title)
                    .setBody(body)
                    .build();

            Message.Builder builder = Message.builder()
                    .setNotification(notification)
                    .setToken(fcmToken)
                    .setAndroidConfig(AndroidConfig.builder()
                            .setNotification(AndroidNotification.builder()
                                    .setIcon("ic_stat_icon_config_sample")
                                    .setColor("#7C3AED")
                                    .setSound("default")
                                    .build())
                            .setPriority(AndroidConfig.Priority.HIGH)
                            .build())
                    .setApnsConfig(ApnsConfig.builder()
                            .setAps(Aps.builder()
                                    .setSound("default")
                                    .setBadge(1)
                                    .build())
                            .build());

            if (data != null && !data.isEmpty()) {
                builder.putAllData(data);
            }

            String messageId = FirebaseMessaging.getInstance().send(builder.build());
            log.debug("Push enviado: {}", messageId);
            return true;
        } catch (FirebaseMessagingException e) {
            if (e.getMessagingErrorCode() == MessagingErrorCode.UNREGISTERED
                    || e.getMessagingErrorCode() == MessagingErrorCode.INVALID_ARGUMENT) {
                log.warn("Token FCM inválido ou expirado, desativando: {}", fcmToken.substring(0, Math.min(20, fcmToken.length())));
            } else {
                log.error("Erro FCM ao enviar para token: {} — {}", fcmToken.substring(0, Math.min(20, fcmToken.length())), e.getMessage());
            }
            return false;
        }
    }

    @Transactional
    public void sendToMultipleUsers(List<User> users, String title, String body) {
        sendToMultipleUsers(users, title, body, null);
    }

    @Transactional
    public void sendToMultipleUsers(List<User> users, String title, String body, Map<String, String> data) {
        if (!isAvailable()) return;

        for (User user : users) {
            try {
                sendToUser(user, title, body, data);
            } catch (Exception e) {
                log.error("Erro ao enviar push para usuário {}: {}", user.getId(), e.getMessage());
            }
        }
    }
}
