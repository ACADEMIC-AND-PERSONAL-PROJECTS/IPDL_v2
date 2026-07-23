package com.example.demo.consultation.entity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
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

    public enum StatutConsultation {
        EN_ATTENTE, ANALYSEE, CLOTUREE
    }

}
