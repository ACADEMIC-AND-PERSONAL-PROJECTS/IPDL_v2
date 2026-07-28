package com.example.demo.ia.controller;

import com.example.demo.ia.ai_exchange.DiagnosticAiResult;
import com.example.demo.ia.service.AiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Tag(name = "Intelligence Artificielle", description = "Analyse des symptomes par IA")
@SecurityRequirement(name = "bearerAuth")
public class AiController {

    private final AiService aiService;

    @PostMapping("/analyser")
    @Operation(summary = "Analyser des symptomes directement")
    @PreAuthorize("hasAnyRole('AGENT', 'MEEDECIN')")
    public ResponseEntity<DiagnosticAiResult> analyser(@RequestParam String symptome, @RequestParam(required = false) String contexte) {
        return ResponseEntity.ok(aiService.analyserSymptomes(symptome, contexte));
    }

}