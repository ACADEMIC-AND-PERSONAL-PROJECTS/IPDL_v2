package com.example.demo.patient.service;

import com.example.demo.patient.entity.Etablissement;
import com.example.demo.patient.repository.EtablissementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EtablissementService {

    private final EtablissementRepository etablissementRepository;

    // Recuperer tout les etablissements qui sont dans la BD
    public List<Etablissement> getAllEtablissement() {
        return etablissementRepository.findAll();
    }

    // Creation d'un etablissement dans la BD
    public Etablissement save(Etablissement etablissement) {
        return etablissementRepository.save(etablissement);
    }

    // Recuperer tous les etablissements d'une region
    public List<Etablissement> getEtablissementByRegion(String region) {
        return etablissementRepository.findByRegion(region);
    }

    // Recuperer un etablisement par son nom
    public Etablissement getEtablissementByName(String name) {
        return etablissementRepository.findByNom(name).get();
    }

}