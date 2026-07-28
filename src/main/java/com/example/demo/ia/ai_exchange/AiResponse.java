package com.example.demo.ia.ai_exchange;

public record AiResponse(
        String diagnostic,
        double scroreConfiance,
        String recommendations
) {}