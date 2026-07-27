package com.example.demo.consultation.controller;

import com.example.demo.consultation.dto.ConsultationRequest;
import com.example.demo.consultation.dto.ConsultationResponse;
import com.example.demo.consultation.entity.Consultation.StatutConsultation;
import com.example.demo.consultation.service.ConsultationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultations")
@RequiredArgsConstructor
@Tag(name = "Consultations", description = "Gestion des consultations medicales")
@SecurityRequirement(name = "bearerAuth")
public class ConsultationController {

    private final ConsultationService consultationService;

    @PostMapping
    @Operation(summary = "Creer une nouvelle consultation")
    @PreAuthorize("hasAnyRole('AGENT', 'MEDECIN', 'ADMIN')")
    public ResponseEntity<ConsultationResponse> creerConsultation(@Valid @RequestBody ConsultationRequest request,
                                                                   @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(consultationService.creerConsultation(request, email));
    }

    @GetMapping
    @Operation(summary = "Lister toutes les consultations")
    @PreAuthorize("hasAnyRole('AGENT', 'MEDECIN', 'ADMIN')")
    public ResponseEntity<List<ConsultationResponse>> getAllConsultations() {
        return ResponseEntity.ok(consultationService.getAllConsultations());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Trouver une consultation par son ID")
    @PreAuthorize("hasAnyRole('AGENT', 'MEDECIN', 'ADMIN')")
    public ResponseEntity<ConsultationResponse> getConsultationById(@PathVariable(name = "id") Long id) {
        return ResponseEntity.ok(consultationService.getConsultationById(id));
    }

    @GetMapping("/patient/{patientId}")
    @Operation(summary = "Lister les consultations d'un patient")
    @PreAuthorize("hasAnyRole('AGENT', 'MEDECIN', 'ADMIN')")
    public ResponseEntity<List<ConsultationResponse>> getConsultationsByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(consultationService.getConsultationsByPatient(patientId));
    }

    @GetMapping("/medecin/{medecinId}")
    @Operation(summary = "Lister les consultations d'un medecin")
    @PreAuthorize("hasAnyRole('AGENT', 'MEDECIN', 'ADMIN')")
    public ResponseEntity<List<ConsultationResponse>> getConsultationsByMedecin(@PathVariable Long medecinId) {
        return ResponseEntity.ok(consultationService.getConsultationsByMedecin(medecinId));
    }

    @GetMapping("/statut/{statut}")
    @Operation(summary = "Filtrer les consultations par statut")
    @PreAuthorize("hasAnyRole('AGENT', 'MEDECIN', 'ADMIN')")
    public ResponseEntity<List<ConsultationResponse>> getConsultationsByStatut(@PathVariable StatutConsultation statut) {
        return ResponseEntity.ok(consultationService.getConsultationsByStatut(statut));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre a jour les informations d'une consultation")
    @PreAuthorize("hasAnyRole('AGENT', 'MEDECIN', 'ADMIN')")
    public ResponseEntity<ConsultationResponse> updateConsultation(@PathVariable(name = "id") Long id,
                                                                    @Valid @RequestBody ConsultationRequest request) {
        return ResponseEntity.ok(consultationService.updateConsultation(id, request));
    }

    @PatchMapping("/{id}/statut")
    @Operation(summary = "Changer le statut d'une consultation")
    @PreAuthorize("hasAnyRole('AGENT', 'MEDECIN', 'ADMIN')")
    public ResponseEntity<ConsultationResponse> updateStatut(@PathVariable(name = "id") Long id,
                                                              @RequestParam StatutConsultation statut) {
        return ResponseEntity.ok(consultationService.updateStatut(id, statut));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer une consultation")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Void> deleteConsultation(@PathVariable(name = "id") Long id) {
        consultationService.deleteConsultation(id);
        return ResponseEntity.noContent().build();
    }

}
