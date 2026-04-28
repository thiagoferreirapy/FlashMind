package com.fliply.controller;

import com.fliply.service.WhatsAppService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/webhook")
@RequiredArgsConstructor
public class WhatsAppWebhookController {

    private final WhatsAppService whatsAppService;

    @PostMapping({"/uazap", "/uazap/**"})
    public ResponseEntity<Void> receive(@RequestBody Map<String, Object> body) {
        try {
            // Ignora webhooks de status (leitura, entrega, etc) para não poluir o log
            String type = String.valueOf(body.get("type"));
            if ("ReadReceipt".equals(type) || "Delivered".equals(body.get("state"))) {
                return ResponseEntity.ok().build();
            }

            log.info("Webhook Uazap recebido: {}", body);

            String phone = extractField(body, "number", "from", "phone", "remoteJid", "sender_pn", "participant", "Chat", "Sender");
            String message = extractField(body, "message", "text", "body", "conversation", "content", "caption", "textMessage");

            log.info("Dados extraídos do Webhook - Phone: {}, Message: {}", phone, message);

            if (phone == null || message == null || message.isBlank()) {
                return ResponseEntity.ok().build();
            }

            // Limpa o @s.whatsapp.net se vier no phone
            phone = phone.split("@")[0];

            // ignora mensagens muito curtas (ex: "ok", "oi", stickers)
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

        // 1. Procura as chaves no nível atual
        for (String key : keys) {
            Object val = map.get(key);
            if (val instanceof String s && !s.isBlank()) return s;
            
            // Se o valor da chave for outro mapa (ex: "textMessage": {"text": "..."})
            if (val instanceof Map<?, ?> innerMap) {
                String found = extractField(innerMap, keys);
                if (found != null) return found;
            }
        }

        // 2. Procura em mapas aninhados (caso a estrutura seja data -> event -> message)
        for (Object value : map.values()) {
            if (value instanceof Map<?, ?> innerMap) {
                String found = extractField(innerMap, keys);
                if (found != null) return found;
            }
        }
        return null;
    }
}
