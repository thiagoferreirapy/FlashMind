package com.flashmind.controller;

import com.flashmind.service.WhatsAppService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/webhook")
@RequiredArgsConstructor
public class WhatsAppWebhookController {

    private final WhatsAppService whatsAppService;

    @Value("${uazap.webhook-secret:}")
    private String webhookSecret;

    @PostMapping({"/uazap", "/uazap/**"})
    public ResponseEntity<Void> receive(
            @RequestHeader(value = "x-webhook-token", required = false) String tokenHeader,
            @RequestParam(value = "token", required = false) String tokenParam,
            @RequestBody Map<String, Object> body) {
        try {
            // Valida o secret se estiver configurado
            if (webhookSecret != null && !webhookSecret.isBlank()) {
                String received = tokenHeader != null ? tokenHeader : tokenParam;
                if (!webhookSecret.equals(received)) {
                    log.warn("Webhook recebido com token inválido — requisição ignorada");
                    return ResponseEntity.status(401).build();
                }
            }

            String type = String.valueOf(body.get("type"));
            if ("ReadReceipt".equals(type) || "Delivered".equals(body.get("state"))) {
                return ResponseEntity.ok().build();
            }

            log.info("Webhook Uazap recebido: {}", body);

            String phone = extractField(body, "number", "from", "phone", "remoteJid", "sender_pn", "participant", "Chat", "Sender");
            String message = extractField(body, "message", "text", "body", "conversation", "content", "caption", "textMessage");

            log.info("Dados extraídos - Phone: {}, Message: {}", phone, message);

            if (phone == null || message == null || message.isBlank()) {
                return ResponseEntity.ok().build();
            }

            phone = phone.split("@")[0];

            if (message.trim().length() < 2) return ResponseEntity.ok().build();

            whatsAppService.processWebhookAnswer(phone, message.trim());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Erro ao processar webhook Uazap: {}", e.getMessage());
            return ResponseEntity.ok().build();
        }
    }

    private String extractField(Map<?, ?> map, String... keys) {
        if (map == null) return null;

        for (String key : keys) {
            Object val = map.get(key);
            if (val instanceof String s && !s.isBlank()) return s;
            if (val instanceof Map<?, ?> innerMap) {
                String found = extractField(innerMap, keys);
                if (found != null) return found;
            }
        }

        for (Object value : map.values()) {
            if (value instanceof Map<?, ?> innerMap) {
                String found = extractField(innerMap, keys);
                if (found != null) return found;
            }
        }
        return null;
    }
}
