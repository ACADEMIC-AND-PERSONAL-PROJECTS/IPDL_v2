package com.example.demo.patient.repository;

import com.example.demo.patient.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    // Trouver les patients de par leur nom
    List<Patient> findByNom (String nom);

    // Trouver les patients d'une region precise
    List <Patient> findByRegion (String region);

    // Trouver les patients de par leur numero de dossier
    Optional<Patient> findByNumeroDossier (String numeroDossier);

    // Trouver les patients par etablissement
    List <Patient> findByEtablissementId (Long etablissementId);

    // Compter les patients par regions
    @Query("SELECT p.region, COUNT(p) FROM Patient p GROUP BY p.region ORDER BY COUNT(p) DESC")
    List<Object[]> countByRegion();

    // Compter les patients par etablissement
    @Query("SELECT p.etablissement.nom, COUNT(p) FROM Patient p GROUP BY p.etablissement.nom ORDER BY COUNT(p) DESC")
    List<Object[]> countByEtablissement();

}