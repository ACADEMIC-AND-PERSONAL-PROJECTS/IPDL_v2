package com.example.demo.patient.dto;

import com.example.demo.patient.entity.Patient;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PatientRequest {

    @NotBlank(message = "Le nom est obligatoire")
    @Size(max = 100)
    private String nom;

    @NotBlank(message = "Le prenom est obligatoire")
    @Size(max = 100)
    private String prenom;

    private LocalDate dateNaissance;

    private Patient.Sexe sexe;

    @Pattern(regexp = "^[0-9]{9}$", message = "Numero de telephone : 9 chiffres")
    private String telephone;

    private String addresse;

    @NotBlank(message = "La region est obligatoire")
    private String region;

    @NotNull(message = "L'etablissement est obligatoire")
    private Long etablissementId;

}