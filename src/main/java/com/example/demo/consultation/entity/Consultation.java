package com.example.demo.consultation.entity;

import com.example.demo.auth.entity.User;
import com.example.demo.patient.entity.Patient;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "consultations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Consultation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime date;

    @Column(columnDefinition = "TEXT")
    private String symptomes;

    @Column(name = "diagnostic_ia", columnDefinition = "TEXT")
    private String diagnosticIa;

    @Column(name = "score_confiance")
    private Double scoreConfiance;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutConsultation statut = StatutConsultation.EN_ATTENTE;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medecin_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User medecin;

    public enum StatutConsultation {
        EN_ATTENTE, ANALYSEE, CLOTUREE
    }

}
