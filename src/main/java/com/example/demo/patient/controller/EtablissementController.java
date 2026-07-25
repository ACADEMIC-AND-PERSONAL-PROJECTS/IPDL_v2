package com.example.demo.patient.controller;

import com.example.demo.patient.entity.Etablissement;
import com.example.demo.patient.service.EtablissementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/etablissements")
@RequiredArgsConstructor
@CrossOrigin("*")
public class EtablissementController {

    private final EtablissementService etablissementService;

    @GetMapping
    @PreAuthorize("hasAnyRole('AGENT', 'MEDECIN', 'ADMIN')")
    public ResponseEntity<List<Etablissement>> findAll() {
        return ResponseEntity.of(Optional.ofNullable(etablissementService.getAllEtablissement()));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Etablissement> createEtablissement(@RequestBody Etablissement etablissement) {
        return ResponseEntity.ok(etablissementService.save(etablissement));
    }

    @GetMapping("/{name}")
    @PreAuthorize("hasAnyRole('AGENT', 'MEDECIN', 'ADMIN')")
    public ResponseEntity<Etablissement> getEtablissementByName(@PathVariable(name = "name") String etablissementName) {
        return ResponseEntity.ok(etablissementService.getEtablissementByName(etablissementName));
    }

    @GetMapping("/region/{region}")
    @PreAuthorize("hasAnyRole('AGENT', 'MEDECIN', 'ADMIN')")
    public ResponseEntity<List<Etablissement>> getEtablissementByRegion(@PathVariable(name = "region") String regionName) {
        return ResponseEntity.ok(etablissementService.getEtablissementByRegion(regionName));
    }

}
