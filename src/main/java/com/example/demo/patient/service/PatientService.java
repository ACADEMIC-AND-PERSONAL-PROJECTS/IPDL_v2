package com.example.demo.patient.service;

import com.example.demo.patient.dto.PatientRequest;
import com.example.demo.patient.dto.PatientResponse;
import com.example.demo.patient.entity.Etablissement;
import com.example.demo.patient.entity.Patient;
import com.example.demo.patient.repository.EtablissementRepository;
import com.example.demo.patient.repository.PatientRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PatientService {

    private final PatientRepository patientRepository;
    private final EtablissementRepository etablissementRepository;

    // Creation d'un patient
    public PatientResponse createPatient(PatientRequest request) {
        Etablissement etablissement = etablissementRepository.findById(request.getEtablissementId()).orElseThrow(
                () -> new RuntimeException("Etablissement introuvable " + request.getEtablissementId())
        );

        Patient patient = new Patient();
        patient.setNom(request.getNom());
        patient.setPrenom(request.getPrenom());
        patient.setDateNaissance(request.getDateNaissance());
        patient.setSexe(request.getSexe());
        patient.setTelephone(request.getTelephone());
        patient.setAdresse(request.getAddresse());
        patient.setRegion(request.getRegion());
        patient.setNumeroDossier(genererNumeroDossier());
        patient.setEtablissement(etablissement);

        return toResponseDto(patientRepository.save(patient));
    }

    // Lister toute les patients
    @Transactional(readOnly = true) // La transaction ne sert qu'a lire des donnees, aucune modification.
    public List<PatientResponse> getAllPatient() {
        return patientRepository.findAll()
                .stream()
                .map(this::toResponseDto)
                .toList();
    }

    // Trouver un patient par son ID
    @Transactional(readOnly = true)
    public PatientResponse getPatientById(Long id) {
        return patientRepository.findById(id)
                .map(this::toResponseDto)
                .orElseThrow(() -> new RuntimeException("Patient introuvable : " + id));
    }

    // Modifier un patient
    public PatientResponse updatePatient(Long id, PatientRequest request) {
        Patient p = patientRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Patient introuvable : " + id)
        );

        p.setNom(request.getNom());
        p.setPrenom(request.getPrenom());
        p.setDateNaissance(request.getDateNaissance());
        p.setSexe(request.getSexe());
        p.setTelephone(request.getTelephone());
        p.setAdresse(request.getAddresse());
        p.setRegion(request.getRegion());

        return toResponseDto(p);
    }

    // Supprimer un patient
    public void deletePatient(Long id) {
        if (!patientRepository.existsById(id)) {
            throw new RuntimeException("Patient introuvable : " + id);
        }
        patientRepository.deleteById(id);
    }

    // Methode pour generer un numero de dossier
    private String genererNumeroDossier() {
        return "SP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    // Rechercher patient par nom
    @Transactional(readOnly = true)
    public List<PatientResponse> getPatientByNom(String nom) {
        return patientRepository.findByNom(nom)
                .stream()
                .map(this::toResponseDto)
                .toList();
    }

    // Convertir entite en une reponse dto
    private PatientResponse toResponseDto(Patient p) {
        return PatientResponse.builder()
                .id(p.getId())
                .nom(p.getNom())
                .prenom(p.getPrenom())
                .dateNaissance(p.getDateNaissance())
                .sexe(p.getSexe())
                .telephone(p.getTelephone())
                .adresse(p.getAdresse())
                .region(p.getRegion())
                .numeroDossier(p.getNumeroDossier())
                .etablissementNom(p.getEtablissement().getNom())
                .etablissementRegion(p.getEtablissement().getRegion())
                .build();
    }

}