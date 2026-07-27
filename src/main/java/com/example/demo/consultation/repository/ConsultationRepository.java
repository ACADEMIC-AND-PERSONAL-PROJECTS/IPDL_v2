package com.example.demo.consultation.repository;

import com.example.demo.consultation.entity.Consultation;
import com.example.demo.consultation.entity.Consultation.StatutConsultation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConsultationRepository extends JpaRepository<Consultation, Long> {

    List<Consultation> findByPatientId(Long patientId);

    List<Consultation> findByMedecinId(Long medecinId);

    List<Consultation> findByStatut(StatutConsultation statut);

    List<Consultation> findByPatientIdAndStatut(Long patientId, StatutConsultation statut);

}
