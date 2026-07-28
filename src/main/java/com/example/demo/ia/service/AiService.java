package com.example.demo.ia.service;

import com.example.demo.ia.ai_exchange.DiagnosticAiResult;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiService {

    private static final String DISCLAIMER = """
            Ceci n'est pas un diagnostic medical.
            Les suggestions de l'IA sont indicatives et ne remplacent en aucun cas,
            l'avis d'un professionnel de santé qualifié.""";

    private static final ObjectMapper objectMapper = new ObjectMapper();

    private final ChatClient chatClient;

    // Analyse les symptômes et retourne un diagnostic structuré
    public DiagnosticAiResult analyserSymptomes(String symptomes, String contextPatient) {
        var fallback = new DiagnosticAiResult("IA indisponible", 0.0, "Consulter un professionnel", DISCLAIMER);
        try {
            String rawResponse = chatClient
                    .prompt(constructUserPrompt(symptomes, contextPatient))
                    .call()
                    .content();
            String sanitized = sanitizeJson(rawResponse);
            log.debug("Raw AI response: {}", rawResponse);
            log.debug("Sanitized AI response: {}", sanitized);
            var result = objectMapper.readValue(sanitized, DiagnosticAiResult.class);
            return new DiagnosticAiResult(result.diagnostic(), result.scoreConfiance(), result.recommandations(), DISCLAIMER);
        } catch (Exception e) {
            log.error("AI Error: {}", e.getMessage());
        }
        return fallback;
    }

    // Nettoie le JSON retourné par l'IA (sauts de ligne dans les chaînes, blocs markdown)
    private String sanitizeJson(String raw) {
        if (raw == null || raw.isBlank()) return raw;
        // Supprimer les blocs de code markdown ```json ... ```
        String json = raw.replaceAll("```(?:json)?\\s*", "").trim();
        // Remplacer les sauts de ligne réels dans les chaînes (cause #1 de JSON invalide avec les LLM)
        json = json.replace("\n", " ").replace("\r", " ");
        return json;
    }

    // Construire un prompt utilisateur bien formaté
    private String constructUserPrompt(String symptomes, String contextPatient) {
        return String.format(
                "Contexte patient : %s%n%nSymptômes décrits :%s",
                contextPatient != null ? contextPatient : "Non précisé", symptomes
        );
    }

}
