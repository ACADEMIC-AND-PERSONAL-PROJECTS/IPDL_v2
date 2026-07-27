package com.example.demo.consultation.dto;

import com.example.demo.consultation.entity.Consultation.StatutConsultation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConsultationResponse {

    private Long id;
    private LocalDateTime date;
    private String symptomes;
    private String diagnosticIa;
    private Double scoreConfiance;
    private StatutConsultation statut;
    private String notes;

    private Long patientId;
    private String patientNom;
    private String patientPrenom;
    private String patientNumeroDossier;

    private String agentNom;
    private String agentEmail;

}