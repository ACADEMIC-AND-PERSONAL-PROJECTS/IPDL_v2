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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @Operation(summary = "Creer une nouvelle consultation pour un patient")
    @PreAuthorize("hasAnyRole('AGENT', 'MEDECIN')")
    public ResponseEntity<ConsultationResponse> creerConsultation(@Valid @RequestBody ConsultationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(consultationService.creerConsultation(request));
    }

    @GetMapping
    @Operation(summary = "Lister toutes les consultations")
    @PreAuthorize("hasAnyRole('MEDECIN', 'ADMIN')")
    public ResponseEntity<List<ConsultationResponse>> getAllConsultations() {
        return ResponseEntity.ok(consultationService.getAllConsultations());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Detail d'une consutation")
    @PreAuthorize("hasAnyRole('AGENT', 'MEDECIN', 'ADMIN')")
    public ResponseEntity<ConsultationResponse> getConsultationById(@PathVariable(name = "id") Long id) {
        return ResponseEntity.ok(consultationService.getConsultationById(id));
    }

    @GetMapping("/patient/{patientId}")
    @Operation(summary = "Lister les consultations d'un patient")
    @PreAuthorize("hasAnyRole('AGENT', 'MEDECIN', 'ADMIN')")
    public ResponseEntity<List<ConsultationResponse>> getConsultationsByPatient(@PathVariable(name = "patientId") Long patientId) {
        return ResponseEntity.ok(consultationService.getConsultationsByPatient(patientId));
    }

    @GetMapping("/mes-consultations")
    @Operation(summary = "Lister les consultations d'un medecin")
    @PreAuthorize("hasAnyRole('AGENT', 'MEDECIN')")
    public ResponseEntity<List<ConsultationResponse>> getConsultationsByAgent() {
        return ResponseEntity.ok(consultationService.getConsultationsByAgent());
    }

    @GetMapping("/statut/{statut}")
    @Operation(summary = "Filtrer les consultations par statut")
    @PreAuthorize("hasAnyRole('AGENT', 'MEDECIN', 'ADMIN')")
    public ResponseEntity<List<ConsultationResponse>> getConsultationsByStatut(@PathVariable StatutConsultation statut) {
        return ResponseEntity.ok(consultationService.getConsultationsByStatut(statut));
    }

    @PatchMapping("/{id}/cloturer")
    @Operation(summary = "Cloturer une consultation")
    @PreAuthorize("hasAnyRole('MEDECIN', 'ADMIN')")
    public ResponseEntity<ConsultationResponse> closeConsultation(@PathVariable(name = "id") Long id, @Valid @RequestParam(required = false) String notes) {
        return ResponseEntity.ok(consultationService.closeConsultation(id, notes));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer une consultation")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Void> deleteConsultation(@PathVariable(name = "id") Long id) {
        consultationService.deleteConsultation(id);
        return ResponseEntity.noContent().build();
    }

}