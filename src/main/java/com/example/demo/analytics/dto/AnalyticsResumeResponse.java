package com.example.demo.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class AnalyticsResumeResponse {

    // ── KPIs principaux ──
    private long totalPatients;
    private long totalConsultations;
    private long consultationsMois;
    private long patientsSansConsultation;
    private double tauxAnalyseIa;
    private double tauxCloture;

    // ── Répartition géographique ──
    private List<StatRegion> patientsByRegion;
    private List<StatRegion> consultationsByRegion;

    // ── Répartition par structure ──
    private List<StatEtablissement> patientsByEtablissement;

    // ── Statuts ──
    private List<StatStaut> consultationsByStatut;

    // ── Évolution temporelle ──
    private List<StatMois> consultations6DerniersMois;
    private List<StatMois> consultationsParMoisAnnee;

    // ── Classes internes ──

    @Data
    @AllArgsConstructor
    public static class StatRegion {
        private String region;
        private long count;
    }

    @Data
    @AllArgsConstructor
    public static class StatStaut {
        private String statut;
        private long count;
    }

    @Data
    @AllArgsConstructor
    public static class StatMois {
        private String mois;
        private long count;
    }

    @Data
    @AllArgsConstructor
    public static class StatEtablissement {
        private String etablissement;
        private long count;
    }
}
