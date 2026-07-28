package com.example.demo.consultation.service;

import com.example.demo.auth.entity.User;
import com.example.demo.auth.repository.UserRepository;
import com.example.demo.consultation.dto.ConsultationRequest;
import com.example.demo.consultation.dto.ConsultationResponse;
import com.example.demo.consultation.entity.Consultation;
import com.example.demo.consultation.entity.Consultation.StatutConsultation;
import com.example.demo.consultation.repository.ConsultationRepository;
import com.example.demo.ia.ai_exchange.DiagnosticAiResult;
import com.example.demo.ia.service.AiService;
import com.example.demo.patient.entity.Patient;
import com.example.demo.patient.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Transactional
public class ConsultationService {

    private final ConsultationRepository consultationRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final AiService aiService;

    public ConsultationResponse creerConsultation(ConsultationRequest request) {
        // Trouver le patient
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient introuvable : " + request.getPatientId()));

        // Trouver l'utilisateur courant depuis le token JWT
        String emailCourant = SecurityContextHolder.getContext().getAuthentication().getName();

        // Trouver l'utilisateur courant sur la base de donnees
        User user = userRepository.findByEmail(emailCourant).orElseThrow(
                () -> new RuntimeException("Utilisateur introuvable : " + emailCourant)
        );

        // Creation de la consultation
        Consultation consultation = Consultation.builder()
                .date(LocalDateTime.now())
                .symptomes(request.getSymptomes())
                .notes(request.getNotes())
                .statut(StatutConsultation.EN_ATTENTE)
                .patient(patient)
                .user(user)
                .build();

        consultation = consultationRepository.save(consultation);

        // Analyser les symptomes
        String contextPatient = String.format(
                "Patient Info - Prenom: %s Nom: %s, Sexe: %s, Region: %s",
                patient.getPrenom(), patient.getNom(),
                patient.getSexe() != null ? patient.getSexe().name() : "Sexe non précisé", patient.getRegion()
        );

        // Recuperer la reponse de l'IA
        DiagnosticAiResult diagnosticAiResult = aiService.analyserSymptomes(request.getSymptomes(), contextPatient);

        // Mettre à jour la consultation (champs diagnostic)
        consultation.setDiagnosticIa(
                diagnosticAiResult.diagnostic() + "\n\n"
                + "Recommandations : " + diagnosticAiResult.recommendations() + "\n\n"
                + diagnosticAiResult.disclaimer()
        );

        // Mettre à jour la consultation (champs score confiance)
        consultation.setScoreConfiance(diagnosticAiResult.scroreConfiance());

        // Mettre à jour le statut de la consultation
        consultation.setStatut(StatutConsultation.ANALYSEE);

        // Retourner la consultation
        return toResponseDto(consultationRepository.save(consultation));
    }

    // Lister toutes les consultations
    @Transactional(readOnly = true)
    public List<ConsultationResponse> getAllConsultations() {
        return consultationRepository.findAll()
                .stream()
                .map(this::toResponseDto)
                .toList();
    }

    // Trouver une consultation par ID
    @Transactional(readOnly = true)
    public ConsultationResponse getConsultationById(Long id) {
        return consultationRepository.findById(id)
                .map(this::toResponseDto)
                .orElseThrow(() -> new RuntimeException("Consultation introuvable : " + id));
    }

    // Trouver les consultations par ID de patient
    @Transactional(readOnly = true)
    public List<ConsultationResponse> getConsultationsByPatient(Long patientId) {
        return consultationRepository.findByPatientIdOrderByDateDesc(patientId)
                .stream()
                .map(this::toResponseDto)
                .toList();
    }

    // Lister les consultations de l'agent courant
    @Transactional(readOnly = true)
    public List<ConsultationResponse> getConsultationsByAgent() {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        return consultationRepository.findByUserEmailOrderByDateDesc(email)
                .stream()
                .map(this::toResponseDto)
                .toList();
    }

    // Trouver une consultation par son statut
    @Transactional(readOnly = true)
    public List<ConsultationResponse> getConsultationsByStatut(StatutConsultation statut) {
        return consultationRepository.findByStatut(statut)
                .stream()
                .map(this::toResponseDto)
                .toList();
    }

    // Cloturer une consultation
    public ConsultationResponse closeConsultation(Long id, String notes) {
        Consultation consultation = consultationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consultation introuvable : " + id));
        consultation.setStatut(StatutConsultation.CLOTUREE);
        if (notes != null) consultation.setNotes(notes);
        return toResponseDto(consultation);
    }

    // Supprimer une consultation
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
                .agentNom(c.getUser().getPrenom() + " " + c.getUser().getNom())
                .agentEmail(c.getUser().getEmail())
                .build();
    }

}
