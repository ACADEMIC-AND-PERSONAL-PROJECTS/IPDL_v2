package com.example.demo.consultation.service;

import com.example.demo.auth.entity.User;
import com.example.demo.auth.repository.UserRepository;
import com.example.demo.consultation.dto.ConsultationRequest;
import com.example.demo.consultation.dto.ConsultationResponse;
import com.example.demo.consultation.entity.Consultation;
import com.example.demo.consultation.entity.Consultation.StatutConsultation;
import com.example.demo.consultation.repository.ConsultationRepository;
import com.example.demo.patient.entity.Patient;
import com.example.demo.patient.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ConsultationService {

    private final ConsultationRepository consultationRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    public ConsultationResponse creerConsultation(ConsultationRequest request, String emailMedecin) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient introuvable : " + request.getPatientId()));

        User medecin = userRepository.findByEmail(emailMedecin)
                .orElseThrow(() -> new RuntimeException("Medecin introuvable : " + emailMedecin));

        Consultation consultation = new Consultation();
        consultation.setDate(LocalDateTime.now());
        consultation.setSymptomes(request.getSymptomes());
        consultation.setNotes(request.getNotes());
        consultation.setStatut(StatutConsultation.EN_ATTENTE);
        consultation.setPatient(patient);
        consultation.setMedecin(medecin);

        return toResponseDto(consultationRepository.save(consultation));
    }

    @Transactional(readOnly = true)
    public List<ConsultationResponse> getAllConsultations() {
        return consultationRepository.findAll()
                .stream()
                .map(this::toResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public ConsultationResponse getConsultationById(Long id) {
        return consultationRepository.findById(id)
                .map(this::toResponseDto)
                .orElseThrow(() -> new RuntimeException("Consultation introuvable : " + id));
    }

    @Transactional(readOnly = true)
    public List<ConsultationResponse> getConsultationsByPatient(Long patientId) {
        return consultationRepository.findByPatientId(patientId)
                .stream()
                .map(this::toResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ConsultationResponse> getConsultationsByMedecin(Long medecinId) {
        return consultationRepository.findByMedecinId(medecinId)
                .stream()
                .map(this::toResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ConsultationResponse> getConsultationsByStatut(StatutConsultation statut) {
        return consultationRepository.findByStatut(statut)
                .stream()
                .map(this::toResponseDto)
                .toList();
    }

    public ConsultationResponse updateStatut(Long id, StatutConsultation nouveauStatut) {
        Consultation consultation = consultationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consultation introuvable : " + id));
        consultation.setStatut(nouveauStatut);
        return toResponseDto(consultation);
    }

    public ConsultationResponse updateConsultation(Long id, ConsultationRequest request) {
        Consultation consultation = consultationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consultation introuvable : " + id));

        consultation.setSymptomes(request.getSymptomes());
        consultation.setNotes(request.getNotes());

        return toResponseDto(consultation);
    }

    public void deleteConsultation(Long id) {
        if (!consultationRepository.existsById(id)) {
            throw new RuntimeException("Consultation introuvable : " + id);
        }
        consultationRepository.deleteById(id);
    }

    private ConsultationResponse toResponseDto(Consultation c) {
        return ConsultationResponse.builder()
                .id(c.getId())
                .date(c.getDate())
                .symptomes(c.getSymptomes())
                .diagnosticIa(c.getDiagnosticIa())
                .scoreConfiance(c.getScoreConfiance())
                .statut(c.getStatut())
                .notes(c.getNotes())
                .patientId(c.getPatient().getId())
                .patientNom(c.getPatient().getNom())
                .patientPrenom(c.getPatient().getPrenom())
                .patientNumeroDossier(c.getPatient().getNumeroDossier())
                .medecinId(c.getMedecin().getId())
                .medecinNom(c.getMedecin().getNom())
                .medecinPrenom(c.getMedecin().getPrenom())
                .build();
    }

}
