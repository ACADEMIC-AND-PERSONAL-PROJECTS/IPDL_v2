package com.example.demo.patient.repository;

import com.example.demo.patient.entity.Etablissement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EtablissementRepository extends JpaRepository<Etablissement, Long> {

    // Recuperer les etablissements par region
    List<Etablissement> findByRegion(String region);

    // Recuperer les etablissements par nom
    Optional<Etablissement> findByNom(String nom);

    // Recuperer les etablissements par type
    List<Etablissement> findByTypeEtablissement(Etablissement.TypeEtablissement type);
    
}