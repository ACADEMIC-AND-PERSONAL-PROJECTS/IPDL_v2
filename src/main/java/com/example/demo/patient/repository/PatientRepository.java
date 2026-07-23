package com.example.demo.patient.repository;

import com.example.demo.patient.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
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

}
