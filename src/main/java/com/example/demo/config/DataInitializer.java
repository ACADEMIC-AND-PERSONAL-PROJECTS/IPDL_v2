package com.example.demo.config;

import com.example.demo.auth.entity.User;
import com.example.demo.auth.entity.User.RoleUser;
import com.example.demo.auth.repository.UserRepository;
import com.example.demo.patient.entity.Etablissement;
import com.example.demo.patient.entity.Patient;
import com.example.demo.patient.entity.Patient.Sexe;
import com.example.demo.patient.repository.EtablissementRepository;
import com.example.demo.patient.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final EtablissementRepository etablissementRepository;
    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String TEST_PASSWORD = "test123";

    @Override
    public void run(String... args) {
        if (etablissementRepository.count() == 0) {
            log.info("Initialisation des donnees de test...");

            Etablissement hopitalDakar = etablissementRepository.save(new Etablissement(
                    null,
                    "Hôpital Principal de Dakar",
                    Etablissement.TypeEtablissement.HOPITAL,
                    "Dakar",
                    "338394040",
                    "Avenue Nelson Mandela, Dakar"
            ));

            Etablissement centreThies = etablissementRepository.save(new Etablissement(
                    null,
                    "Centre de Santé de Thiès",
                    Etablissement.TypeEtablissement.CENTRE_SANTE,
                    "Thiès",
                    "339511234",
                    "Quartier Médina, Thiès"
            ));

            Etablissement posteTambacounda = etablissementRepository.save(new Etablissement(
                    null,
                    "Poste de Santé de Tambacounda",
                    Etablissement.TypeEtablissement.POST_SANTE,
                    "Tambacounda",
                    "339813456",
                    "Centre-ville, Tambacounda"
            ));

            log.info("3 établissements créés.");

            creerUtilisateurs(hopitalDakar, "dakar");
            creerUtilisateurs(centreThies, "thies");
            creerUtilisateurs(posteTambacounda, "tamba");

            log.info("9 utilisateurs de test créés (3 par établissement).");

            creerPatients(hopitalDakar, "Dakar");
            creerPatients(centreThies, "Thiès");
            creerPatients(posteTambacounda, "Tambacounda");

            log.info("6 patients de test créés (2 par établissement).");
        }
    }

    private void creerUtilisateurs(Etablissement etablissement, String suffixe) {
        String motDePasse = passwordEncoder.encode(TEST_PASSWORD);

        List<User> utilisateurs = List.of(
                new User(null, "Agent", suffixeToPrenom(suffixe),
                        "agent." + suffixe + "@sensante.sn",
                        motDePasse, RoleUser.AGENT, etablissement),

                new User(null, "Medecin", suffixeToPrenom(suffixe),
                        "medecin." + suffixe + "@sensante.sn",
                        motDePasse, RoleUser.MEDECIN, etablissement),

                new User(null, "Admin", suffixeToPrenom(suffixe),
                        "admin." + suffixe + "@sensante.sn",
                        motDePasse, RoleUser.ADMIN, etablissement)
        );

        userRepository.saveAll(utilisateurs);
    }

    private void creerPatients(Etablissement etablissement, String region) {
        List<Patient> patients = List.of(
                new Patient(null,
                        "Diop", "Mamadou",
                        LocalDate.of(1985, 4, 12),
                        Sexe.MASCULIN,
                        "770000001",
                        "Rue 10, Quartier Nord",
                        region,
                        genererNumeroDossier(),
                        etablissement),

                new Patient(null,
                        "Sow", "Aminata",
                        LocalDate.of(1992, 8, 25),
                        Sexe.FEMININ,
                        "770000002",
                        "Avenue de l'Indépendance",
                        region,
                        genererNumeroDossier(),
                        etablissement)
        );

        patientRepository.saveAll(patients);
    }

    private String genererNumeroDossier() {
        return "SP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private String suffixeToPrenom(String suffixe) {
        return switch (suffixe) {
            case "dakar" -> "Dakar";
            case "thies" -> "Thiès";
            case "tamba" -> "Tambacounda";
            default -> "Inconnu";
        };
    }

}
