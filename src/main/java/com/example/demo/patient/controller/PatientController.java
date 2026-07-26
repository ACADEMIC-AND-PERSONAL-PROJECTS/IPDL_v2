package com.example.demo.patient.controller;

import com.example.demo.patient.dto.PatientRequest;
import com.example.demo.patient.dto.PatientResponse;
import com.example.demo.patient.service.PatientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
@Tag(name = "Patients", description = "Gestion des dossiers patients")
@SecurityRequirement(name = "bearerAuth")
public class PatientController {

    private final PatientService patientService;

    @GetMapping
    @Operation(summary = "Lister tous les patients")
    @PreAuthorize("hasAnyRole('AGENT', 'MEDECIN', 'ADMIN')")
    public ResponseEntity<List<PatientResponse>> getAllPatient() {
        return ResponseEntity.ok(patientService.getAllPatient());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Trouver un patient par son ID")
    @PreAuthorize("hasAnyRole('AGENT', 'MEDECIN', 'ADMIN')")
    public ResponseEntity<PatientResponse> getPatientById(@PathVariable(name = "id") Long id) {
        return ResponseEntity.ok(patientService.getPatientById(id));
    }

    @GetMapping("/search")
    @Operation(summary = "Rechercher des patients par nom")
    @PreAuthorize("hasAnyRole('AGENT', 'MEDECIN', 'ADMIN')")
    public ResponseEntity<List<PatientResponse>> getPatientByName(@RequestParam String name) {
        return ResponseEntity.ok(patientService.getPatientByNom(name));
    }

    @PostMapping
    @Operation(summary = "Ajouter un nouveau patient")
    @PreAuthorize("hasAnyRole('AGENT', 'MEDECIN', 'ADMIN')")
    public ResponseEntity<PatientResponse> createPatient(@Valid @RequestBody PatientRequest request) {
        return ResponseEntity.ok(patientService.createPatient(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre a jour des informations d'un patient")
    @PreAuthorize("hasAnyRole('AGENT', 'MEDECIN', 'ADMIN')")
    public ResponseEntity<PatientResponse> updatePatient(@PathVariable(name = "id") Long id, @Valid @RequestBody PatientRequest request) {
        return ResponseEntity.ok(patientService.updatePatient(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un patient")
    @PreAuthorize("hasAnyRole('AGENT', 'MEDECIN', 'ADMIN')")
    public ResponseEntity<Void> detelePatient(@PathVariable(name = "id") Long id) {
        patientService.deletePatient(id);
        return ResponseEntity.noContent().build();
    }

}