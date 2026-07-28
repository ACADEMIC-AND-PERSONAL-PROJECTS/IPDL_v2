package com.example.demo.ia.ai_exchange;

public record DiagnosticAiResult(
        String diagnostic,
        double scroreConfiance,
        String recommendations,
        String disclaimer
) {}