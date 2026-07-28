package com.example.demo.ia.service;

import com.example.demo.ia.ai_exchange.DiagnosticAiResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class DiagnosticAiService {

    private final ChatClient chatClient;

    // Analyse les symptômes et retourne un diagnostic structure
    public DiagnosticAiResult analyserSymptomes(String symptomes, String contextPatient) {
        String DISCLAIMER = """
                Ceci n'est pas un diagnostic medical.
                Les suggestions de l'IA sont indicatives et ne remplacent en aucun cas,
                l'avis d'un professionnel de santé qualifié.
                """;
        var diagnosticIA = new DiagnosticAiResult("IA indisponible", 0.0, "Consulter un professionnel", DISCLAIMER);
        try {
            diagnosticIA = chatClient
                    .prompt(constructUserPrompt(symptomes, contextPatient + " colle ceci pour le disclaimer: " + DISCLAIMER))
                    .call()
                    .entity(DiagnosticAiResult.class);
        } catch (Exception e) {
            log.error("AI Error: {}", e.getMessage());
        }

        return diagnosticIA;
    }

    // Construire un prompt utilisateur bien formatter
    private String constructUserPrompt(String symptomes, String contextPatient) {
        return String.format(
                "Contexte patient : %s%n%nSymptomes décrits :%s",
                contextPatient != null ? contextPatient : "Non precisé", symptomes
        );
    }

}
