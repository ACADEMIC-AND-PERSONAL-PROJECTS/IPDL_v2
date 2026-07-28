package com.example.demo.analytics.service;

import com.example.demo.analytics.dto.AnalyticsResumeResponse;
import com.example.demo.analytics.dto.AnalyticsResumeResponse.*;
import com.example.demo.consultation.entity.Consultation.StatutConsultation;
import com.example.demo.consultation.repository.ConsultationRepository;
import com.example.demo.patient.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalyticsService {

    private final PatientRepository patientRepository;
    private final ConsultationRepository consultationRepository;

    public AnalyticsResumeResponse getResume() {

        // ── KPIs de base ──
        long totalPatients = patientRepository.count();
        long totalConsultations = consultationRepository.count();
        long aiAnalyses = consultationRepository.countAiAnalyses();
        double tauxIa = totalConsultations > 0
                ? Math.round((double) aiAnalyses / totalConsultations * 1000) / 10.0
                : 0.0;

        // ── Consultations du mois en cours ──
        long consultationsMois = consultationRepository.countConsultationByDate()
                .stream()
                .findFirst()
                .map(r -> (Long) r[1])
                .orElse(0L);

        // ── Patients sans aucune consultation ──
        long patientsSansConsultation = patientRepository.countPatientByNoConsultations();

        // ── Taux de clôture ──
        double tauxCloture = calculerTauxCloture(totalConsultations);

        // ── Patients par région ──
        List<StatRegion> patientsByRegion = patientRepository.countByRegion().stream()
                .map(r -> new StatRegion((String) r[0], (Long) r[1]))
                .toList();

        // ── Consultations par région ──
        List<StatRegion> consultationsByRegion = consultationRepository.countConsultationsByRegion().stream()
                .map(r -> new StatRegion((String) r[0], (Long) r[1]))
                .toList();

        // ── Patients par établissement ──
        List<StatEtablissement> patientsByEtablissement = patientRepository.countByEtablissement().stream()
                .map(r -> new StatEtablissement((String) r[0], (Long) r[1]))
                .toList();

        // ── Consultations par statut ──
        List<StatStaut> consultationsByStatut = consultationRepository.countConsultationsByStatut().stream()
                .map(r -> new StatStaut(r[0].toString(), (Long) r[1]))
                .toList();

        // ── Consultations des 6 derniers mois ──
        LocalDateTime debut6Mois = LocalDateTime.now().minusMonths(6);
        List<StatMois> consultations6DerniersMois = consultationRepository.countConsultationByDateMonth6(debut6Mois)
                .stream()
                .map(r -> {
                    int moisNum = ((Number) r[0]).intValue();
                    int annee = ((Number) r[1]).intValue();
                    String label = Month.of(moisNum).getDisplayName(TextStyle.SHORT, Locale.FRENCH) + " " + annee;
                    return new StatMois(label, (Long) r[2]);
                })
                .toList();

        // ── Consultations par mois (année en cours) ──
        List<StatMois> consultationsParMoisAnnee = consultationRepository.countConsultationsParMois().stream()
                .map(r -> {
                    int moisNum = ((Number) r[0]).intValue();
                    String label = Month.of(moisNum).getDisplayName(TextStyle.SHORT, Locale.FRENCH);
                    return new StatMois(label, (Long) r[1]);
                })
                .toList();

        return new AnalyticsResumeResponse(
                totalPatients,
                totalConsultations,
                consultationsMois,
                patientsSansConsultation,
                tauxIa,
                tauxCloture,
                patientsByRegion,
                consultationsByRegion,
                patientsByEtablissement,
                consultationsByStatut,
                consultations6DerniersMois,
                consultationsParMoisAnnee
        );
    }

    private double calculerTauxCloture(long total) {
        if (total == 0) return 0.0;
        long cloturees = consultationRepository.countConsultationsByStatut().stream()
                .filter(r -> StatutConsultation.CLOTUREE.name().equals(r[0].toString()))
                .mapToLong(r -> (Long) r[1])
                .findFirst()
                .orElse(0L);
        return Math.round((double) cloturees / total * 1000) / 10.0;
    }
}