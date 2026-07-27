package com.example.demo.consultation.repository;

import com.example.demo.consultation.entity.Consultation;
import com.example.demo.consultation.entity.Consultation.StatutConsultation;
import org.springframework.data.jpa.repository.JpaRepository;

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

}
