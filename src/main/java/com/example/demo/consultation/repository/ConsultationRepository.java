package com.example.demo.consultation.repository;

import com.example.demo.consultation.entity.Consultation;
import com.example.demo.consultation.entity.Consultation.StatutConsultation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ConsultationRepository extends JpaRepository<Consultation, Long> {

    // Toutes les consultations d'un patient triees par date croissante
    List<Consultation> findByPatientIdOrderByDateDesc(Long patientId);

    // Toutes les consultations saisies par un agent
    List<Consultation> findByUserEmailOrderByDateDesc(String email);

    // Consultations en attentes
    List<Consultation> findByStatut(StatutConsultation statut);

    // Nombre de consultations par patient
    long countByPatientId(Long patientId);

    // Nombre de consultations du mois
    @Query("SELECT MONTH(c.date), COUNT(c) " +
            "FROM Consultation c " +
            "WHERE MONTH(c.date)= MONTH(CURRENT_DATE) AND YEAR(c.date)=YEAR(CURRENT_DATE)")
    List<Object[]> countConsultationByDate();

    // Nombre de consultations par mois au cours de l'annee
    @Query("SELECT MONTH(c.date), COUNT(c) " +
            "FROM Consultation c " +
            "WHERE YEAR(c.date) = YEAR(CURRENT_DATE) " +
            "GROUP BY MONTH(c.date)")
    List<Object[]> countConsultationsParMois();

    // Compter les consultation par region
    @Query("SELECT c.patient.region, COUNT(c) " +
            "FROM Consultation c " +
            "GROUP BY c.patient.region " +
            "ORDER BY COUNT(c) DESC")
    List<Object[]> countConsultationsByRegion();

    // Consultation par statut
    @Query("SELECT c.statut, COUNT(c) FROM Consultation c GROUP BY c.statut ORDER BY COUNT(c) DESC")
    List<Object[]> countConsultationsByStatut();

    // Consultations pour les 6 derniers mois
    @Query("SELECT MONTH(c.date), YEAR(c.date), COUNT(c.date) " +
            "FROM Consultation c " +
            "WHERE c.date >= :debut " +
            "GROUP BY YEAR(c.date), MONTH(c.date) " +
            "ORDER BY YEAR(c.date), MONTH(c.date)")
    List<Object[]> countConsultationByDateMonth6();

    // Taux d'analyse IA
    @Query("SELECT COUNT(c) " +
            "FROM Consultation c " +
            "WHERE c.diagnosticIa IS NOT NULL ")
    long countAiAnalyses();

}