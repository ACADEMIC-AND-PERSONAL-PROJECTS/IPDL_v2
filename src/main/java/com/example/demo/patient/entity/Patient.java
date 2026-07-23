package com.example.demo.patient.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "patient")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column (nullable = false, length = 100)
    private String nom;

    @Column (nullable = false, length = 100)
    private String prenom;

    @Column (name = "date_naissance")
    private LocalDate dateNaissance;

    @Enumerated (EnumType.STRING)
    private Sexe sexe;

    @Column (length = 20)
    private String telephone;

    @Column (length = 300)
    private String adresse;

    @Column (length = 100)
    private String region;

    @Column (name = "numero_dossier", unique = true , length = 50)
    private String numeroDossier;

    @ManyToOne (fetch = FetchType .LAZY)
    @JoinColumn (name = " etablissement_id ", nullable = false)
    private Etablissement etablissement;

    public enum Sexe {
        MASCULIN, FEMININ
    }

}