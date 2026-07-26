package com.example.demo.patient.dto;

import com.example.demo.patient.entity.Patient;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientResponse {
    private Long id;
    private String nom;
    private String prenom;
    private LocalDate dateNaissance;
    private Patient.Sexe sexe;
    private String telephone;
    private String adresse;
    private String region;
    private String numeroDossier;
    private String etablissementNom;
    private String etablissementRegion;
}