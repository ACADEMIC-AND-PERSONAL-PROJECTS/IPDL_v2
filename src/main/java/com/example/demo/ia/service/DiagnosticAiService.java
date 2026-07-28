package com.example.demo.ia.service;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AiService {

    private final ChatClient chatClient;

    private final String DISCLAIMER = """
            Ceci n'est pas un diagnostic medical.
            Les suggestions de l'IA sont indicatives et ne remplacent en aucun cas,
            l'avis d'un professionnel de santé qualifié.
            """;

    public 

}
