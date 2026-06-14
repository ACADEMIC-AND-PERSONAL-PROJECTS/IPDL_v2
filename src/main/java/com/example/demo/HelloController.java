package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HelloController {

    @GetMapping("/hello")
    public Map<String, String> hello() {
        Map<String, String> response = new HashMap<>();
        response.put("Message", "[-_-] Bienvenu sur SenSante Pro [-_-]");
        response.put("version", "v0.1");
        response.put("statut", "Operationnel");
        return response;
    }

    @GetMapping("/sante")
    public Map<String, Object> sante() {
        Map<String, Object> response = new HashMap<>();
        response.put("application", "SenSante Pro");
        response.put("description", "Plateforme de sante communautaire");
        response.put("etablissement", new String[] {
                "Hopital Pricipal de Dakar",
                "Centre de Sante de Thies",
                "Poste de Sante de Tambacounda"
        });
        return response;
    }

}