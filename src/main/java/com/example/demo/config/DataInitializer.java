package com.example.demo.config;

import com.example.demo.patient.entity.Etablissement;
import com.example.demo.patient.repository.EtablissementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final EtablissementRepository etablissementRepository;

    @Override
    public void run(String... args) {
        if (etablissementRepository.count() == 0) {
            log.info("Initialisation des donnees de test...");

            etablissementRepository.save(new Etablissement(
                    null,
                    "Hôpital Principal de Dakar",
                    Etablissement.TypeEtablissement.HOPITAL,
                    "Dakar",
                    "338394040",
                    "Avenue Nelson Mandela, Dakar"
            ));

            etablissementRepository.save(new Etablissement(
                    null,
                    "Centre de Santé de Thiès",
                    Etablissement.TypeEtablissement.CENTRE_SANTE,
                    "Thiès",
                    "339511234",
                    "Quartier Médina, Thiès"
            ));

            etablissementRepository.save(new Etablissement(
                    null,
                    "Poste de Santé de Tambacounda",
                    Etablissement.TypeEtablissement.POST_SANTE,
                    "Tambacounda",
                    "339813456",
                    "Centre-ville, Tambacounda"
            ));

            log.info("3 établissements créés.");
        }
    }

}
