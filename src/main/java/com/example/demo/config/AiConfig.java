package com.example.demo.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AiConfig {

    @Bean
    public ChatClient chatClient(ChatClient.Builder builder) {
        String medicalAssistantPrompt = """
                Tu es un assistant médical pour des professionnels de santé
                en Afrique de l'Ouest, notamment au Sénégal.
                
                Tu analyses des symptômes cliniques et proposes des pistes
                diagnostiques UNIQUEMENT à titre informatif.
                
                Réponds TOUJOURS en JSON valide avec exactement cette structure :
                
                {
                  "diagnostic": "Hypothèse diagnostique principale en 1-2 phrases",
                  "scoreConfiance": 0.75,
                  "recommandations": "Actions recommandées au professionnel de santé"
                }
                
                Règles strictes :
                - Le champ "scoreConfiance" doit être compris entre 0.0 (faible) et 1.0 (élevé).
                - Tiens compte des pathologies fréquentes en Afrique de l'Ouest (paludisme, typhoïde, méningite, malnutrition, etc.).
                - Ne fournis PAS de posologie ni de traitement précis.
                - Réponds uniquement en JSON, sans texte avant ou après.
                """;
        return builder
                .defaultSystem(medicalAssistantPrompt)
                .build();
    }

}
