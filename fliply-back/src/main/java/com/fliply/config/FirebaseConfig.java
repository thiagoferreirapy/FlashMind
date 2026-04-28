package com.fliply.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Slf4j
@Configuration
public class FirebaseConfig {

    @Value("${firebase.project-id:}")
    private String projectId;

    @Value("${firebase.client-email:}")
    private String clientEmail;

    @Value("${firebase.private-key:}")
    private String privateKey;

    @PostConstruct
    public void initialize() {
        if (projectId.isBlank() || clientEmail.isBlank() || privateKey.isBlank()) {
            log.warn("Firebase não configurado — push notifications desabilitadas. Defina FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY no .env");
            return;
        }

        if (!FirebaseApp.getApps().isEmpty()) {
            log.debug("Firebase já inicializado");
            return;
        }

        try {
            String fixedKey = privateKey.replace("\\n", "\n");
            String serviceAccountJson = buildServiceAccountJson(projectId, clientEmail, fixedKey);

            InputStream stream = new ByteArrayInputStream(serviceAccountJson.getBytes(StandardCharsets.UTF_8));
            GoogleCredentials credentials = GoogleCredentials.fromStream(stream);

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(credentials)
                    .setProjectId(projectId)
                    .build();

            FirebaseApp.initializeApp(options);
            log.info("Firebase inicializado com sucesso para projeto: {}", projectId);
        } catch (IOException e) {
            log.error("Falha ao inicializar Firebase: {}", e.getMessage());
        }
    }

    private String buildServiceAccountJson(String projectId, String clientEmail, String privateKey) {
        String escapedKey = privateKey.replace("\"", "\\\"");
        return "{"
            + "\"type\":\"service_account\","
            + "\"project_id\":\"" + projectId + "\","
            + "\"private_key\":\"" + escapedKey + "\","
            + "\"client_email\":\"" + clientEmail + "\","
            + "\"token_uri\":\"https://oauth2.googleapis.com/token\""
            + "}";
    }
}
