package com.example.demo.config;

import com.example.demo.auth.entity.User;
import com.example.demo.auth.entity.User.RoleUser;
import com.example.demo.auth.repository.UserRepository;
import com.example.demo.consultation.entity.Consultation;
import com.example.demo.consultation.entity.Consultation.StatutConsultation;
import com.example.demo.consultation.repository.ConsultationRepository;
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
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final EtablissementRepository etablissementRepository;
    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final ConsultationRepository consultationRepository;
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

            List<User> usersDakar = creerUtilisateurs(hopitalDakar, "dakar");
            List<User> usersThies = creerUtilisateurs(centreThies, "thies");
            List<User> usersTamba = creerUtilisateurs(posteTambacounda, "tamba");

            log.info("9 utilisateurs de test créés (3 par établissement).");

            List<Patient> patientsDakar = creerPatients(hopitalDakar, "Dakar");
            List<Patient> patientsThies = creerPatients(centreThies, "Thiès");
            List<Patient> patientsTamba = creerPatients(posteTambacounda, "Tambacounda");

            log.info("6 patients de test créés (2 par établissement).");

            creerConsultations(patientsDakar, usersDakar);
            creerConsultations(patientsThies, usersThies);
            creerConsultations(patientsTamba, usersTamba);

            log.info("Consultations de test créées.");
        }
    }

    private List<User> creerUtilisateurs(Etablissement etablissement, String suffixe) {
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

        return userRepository.saveAll(utilisateurs);
    }

    private List<Patient> creerPatients(Etablissement etablissement, String region) {
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

        return patientRepository.saveAll(patients);
    }

    private void creerConsultations(List<Patient> patients, List<User> users) {
        User agent = users.stream()
                .filter(u -> u.getRole() == RoleUser.AGENT)
                .findFirst().orElseThrow();
        User medecin = users.stream()
                .filter(u -> u.getRole() == RoleUser.MEDECIN)
                .findFirst().orElseThrow();

        Patient premierPatient = patients.get(0);
        Patient deuxiemePatient = patients.get(1);

        List<Consultation> consultations = List.of(
                Consultation.builder()
                        .date(LocalDateTime.now().minusDays(5))
                        .symptomes("Fièvre 39 °C depuis 3 jours. Céphalées intenses. Courbatures généralisées.")
                        .diagnosticIa("Paludisme simple - Plasmodium falciparum")
                        .scoreConfiance(0.94)
                        .statut(StatutConsultation.CLOTUREE)
                        .notes("Patient vu en urgence. TDR positif. Traitement ACT prescrit. RDV de contrôle dans 1 semaine.")
                        .patient(premierPatient)
                        .user(medecin)
                        .build(),

                Consultation.builder()
                        .date(LocalDateTime.now().minusDays(2))
                        .symptomes("Douleurs abdominales diffuses. Brûlures mictionnelles. Pollakiurie.")
                        .diagnosticIa("Infection urinaire basse - Cystite aiguë")
                        .scoreConfiance(0.87)
                        .statut(StatutConsultation.ANALYSEE)
                        .patient(deuxiemePatient)
                        .user(medecin)
                        .build(),

                Consultation.builder()
                        .date(LocalDateTime.now().minusHours(6))
                        .symptomes("Toux productive depuis 1 semaine. Douleur thoracique légère. Expectorations verdâtres.")
                        .notes("Auscultation : râles bronchiques bilatéraux. Patient tabagique. À orienter vers radiographie.")
                        .statut(StatutConsultation.EN_ATTENTE)
                        .patient(premierPatient)
                        .user(agent)
                        .build(),

                Consultation.builder()
                        .date(LocalDateTime.now().minusDays(10))
                        .symptomes("Céphalées chroniques. Vertiges occasionnels. Acouphènes.")
                        .diagnosticIa("Hypertension artérielle essentielle stade 1")
                        .scoreConfiance(0.91)
                        .statut(StatutConsultation.CLOTUREE)
                        .notes("TA 148/92 mmHg. Conseils hygiéno-diététiques. Suivi tensionnel à domicile. Contrôle dans 3 mois.")
                        .patient(deuxiemePatient)
                        .user(medecin)
                        .build()
        );

        consultationRepository.saveAll(consultations);
        log.info("{} : {} consultations créées.", agent.getEtablissement().getNom(), consultations.size());
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
