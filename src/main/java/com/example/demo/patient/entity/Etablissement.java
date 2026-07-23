package com.example.demo.patient.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "etablissements")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Etablissement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String nom;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeEtablissement typeEtablissement;

    @Column(nullable = false, length = 100)
    private String region;

    @Column(length = 20)
    private String telephone;

    @Column(length = 300)
    private String adresse;

    public enum TypeEtablissement {
        HOPITAL, CENTRE_SANTE, POST_SANTE
    }

}
