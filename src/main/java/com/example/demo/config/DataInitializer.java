package com.example.demo.config;

import com.example.demo.auth.entity.User;
import com.example.demo.auth.entity.User.RoleUser;
import com.example.demo.auth.repository.UserRepository;
import com.example.demo.patient.entity.Etablissement;
import com.example.demo.patient.repository.EtablissementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final EtablissementRepository etablissementRepository;
    private final UserRepository userRepository;
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

    private String suffixeToPrenom(String suffixe) {
        return switch (suffixe) {
            case "dakar" -> "Dakar";
            case "thies" -> "Thiès";
            case "tamba" -> "Tambacounda";
            default -> "Inconnu";
        };
    }

}
