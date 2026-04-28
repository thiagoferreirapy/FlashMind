package com.fliply.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@lombok.extern.slf4j.Slf4j
@Service
public class GeminiService {

    private static final String GEMINI_URL_TEMPLATE =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=%s";

    @Value("${gemini.api.key}")
    private String apiKey;

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String evaluate(String question, String correctAnswer, String userAnswer) {
        String prompt = """
            Pergunta: %s
            Resposta correta: %s
            Resposta do usuário: %s

            Classifique apenas como uma das três opções abaixo (responda somente a palavra):
            CERTO
            QUASE
            ERRADO
            """.formatted(question, correctAnswer, userAnswer);
        try {
            String result = chat(prompt).trim().toUpperCase().replaceAll("[^A-Z]", "");
            return switch (result) {
                case "CERTO" -> "right";
                case "QUASE" -> "unsure";
                default -> "wrong";
            };
        } catch (Exception e) {
            log.error("Falha ao avaliar resposta: {}", e.getMessage());
            return "wrong";
        }
    }

    public String chat(String message) {
        try {
            String body = String.format("""
                {
                  "contents": [{
                    "parts": [{"text": %s}]
                  }]
                }
                """, objectMapper.writeValueAsString(message));

            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(String.format(GEMINI_URL_TEMPLATE, apiKey)))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            JsonNode root = objectMapper.readTree(response.body());

            if (root.has("error")) {
                String errorMsg = root.path("error").path("message").asText("Erro desconhecido da API");
                log.error("Erro na API do Gemini: {} - Payload: {}", errorMsg, response.body());
                throw new RuntimeException("Gemini API error: " + errorMsg);
            }

            if (!root.has("candidates") || root.path("candidates").isEmpty()) {
                log.warn("Gemini não retornou resposta (possível bloqueio de segurança). Body: {}", response.body());
                throw new RuntimeException("Nenhuma resposta do Gemini");
            }

            return root.path("candidates").get(0)
                .path("content").path("parts").get(0)
                .path("text").asText();

        } catch (Exception e) {
            log.error("Erro de comunicação com Gemini: {}", e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }
}
