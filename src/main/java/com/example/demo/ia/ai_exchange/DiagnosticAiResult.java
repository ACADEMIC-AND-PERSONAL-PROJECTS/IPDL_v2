package com.example.demo.ia.ai_exchange;

import com.fasterxml.jackson.annotation.JsonProperty;

public record DiagnosticAiResult(
        String diagnostic,
        @JsonProperty("scoreConfiance") double scoreConfiance,
        @JsonProperty("recommandations") String recommandations,
        String disclaimer
) {}