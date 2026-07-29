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
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

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

    // ── Banques de données médicales realistés (Afrique de l'Ouest) ──

    private static final List<SymptomeDiagnostic> SCENARIOS = List.of(
            new SymptomeDiagnostic(
                    "Fièvre 39°C depuis 3 jours. Céphalées intenses. Courbatures généralisées. Frissons.",
                    "Paludisme simple - Plasmodium falciparum", 0.94, StatutConsultation.CLOTUREE,
                    "TDR positif. Traitement ACT prescrit. RDV de contrôle dans 1 semaine."
            ),
            new SymptomeDiagnostic(
                    "Douleurs abdominales diffuses. Brûlures mictionnelles. Pollakiurie. Urines troubles.",
                    "Infection urinaire basse - Cystite aiguë", 0.87, StatutConsultation.ANALYSEE,
                    "BU positive aux leucocytes et nitrites. ECBU demandé."
            ),
            new SymptomeDiagnostic(
                    "Toux productive depuis 1 semaine. Douleur thoracique légère. Expectorations verdâtres. Fièvre 38.2°C.",
                    "Bronchite aiguë infectieuse", 0.82, StatutConsultation.CLOTUREE,
                    "Auscultation : râles bronchiques bilatéraux. Antibiothérapie orale 7 jours."
            ),
            new SymptomeDiagnostic(
                    "Céphalées chroniques. Vertiges occasionnels. Acouphènes. Epistaxis récentes.",
                    "Hypertension artérielle essentielle stade 1", 0.91, StatutConsultation.CLOTUREE,
                    "TA 148/92 mmHg. Conseils hygiéno-diététiques. Suivi tensionnel à domicile. Contrôle dans 3 mois."
            ),
            new SymptomeDiagnostic(
                    "Diarrhée aqueuse depuis 48h. Douleurs abdominales. Nausées. Pas de fièvre.",
                    "Gastro-entérite aiguë virale", 0.78, StatutConsultation.CLOTUREE,
                    "Réhydratation orale. Surveillance signes de déshydratation. Régime anti-diarrhéique."
            ),
            new SymptomeDiagnostic(
                    "Amaigrissement inexpliqué. Fatigue chronique. Sueurs nocturnes. Toux persistante depuis 1 mois.",
                    "Tuberculose pulmonaire suspectée", 0.76, StatutConsultation.ANALYSEE,
                    "Test GeneXpert demandé. Isolement respiratoire provisoire. BK crachats x3."
            ),
            new SymptomeDiagnostic(
                    "Céphalées frontales. Rhinorrhée purulente. Obstruction nasale bilatérale depuis 10 jours.",
                    "Sinusite aiguë bactérienne", 0.89, StatutConsultation.CLOTUREE,
                    "Antibiothérapie 10 jours. Lavage de nez au sérum physiologique. Antalgiques."
            ),
            new SymptomeDiagnostic(
                    "Lombalgie mécanique chronique. Irradiation fesse droite. Aggravée par la position assise.",
                    "Lombosciatique droite - Hernie discale L4-L5", 0.84, StatutConsultation.ANALYSEE,
                    "IRM lombaire demandée. Antalgiques palier 2. Kinésithérapie prescrite."
            ),
            new SymptomeDiagnostic(
                    "Prurit cutané généralisé. Lésions de grattage entre les doigts. Atteinte familiale.",
                    "Gale sarcoptique commune", 0.96, StatutConsultation.CLOTUREE,
                    "Traitement Benzoate de Benzyle. Literie décontaminée. Dépistage familial."
            ),
            new SymptomeDiagnostic(
                    "Ictère conjonctival. Urines foncées. Douleur hypocondre droit. Nausées depuis 5 jours.",
                    "Hépatite virale aiguë - suspicion hépatite E", 0.72, StatutConsultation.ANALYSEE,
                    "Bilan hépatique demandé. Sérologies hépatites virales. Repos strict."
            ),
            new SymptomeDiagnostic(
                    "Plaie au pied droit. Écoulement purulent. Œdème local. Notion de diabète. Déséquilibre glycémique.",
                    "Pied diabétique infecté - Grade 2", 0.93, StatutConsultation.CLOTUREE,
                    "Débridement local. Antibiothérapie ciblée. Équilibre glycémique. Soins IDE quotidiens."
            ),
            new SymptomeDiagnostic(
                    "Convulsions fébriles chez enfant de 3 ans. Perte de connaissance brève. Antécédent de paludisme.",
                    "Crise convulsive fébrile - Neuropaludisme suspecté", 0.65, StatutConsultation.EN_ATTENTE,
                    "TDR Paludisme en urgence. À transférer si confirmé. Surveillance neurologique."
            ),
            new SymptomeDiagnostic(
                    "Douleur épigastrique à jeun. Brûlures rétrosternales. Régurgitations acides. Calmé par alimentation.",
                    "Ulcère gastroduodénal - Gastrite chronique à Helicobacter pylori", 0.88, StatutConsultation.CLOTUREE,
                    "Test Helicobacter demandé. IPP prescrits. Éviction AINS. Régime adapté."
            ),
            new SymptomeDiagnostic(
                    "Dyspnée d'effort. Toux sèche nocturne. Orthopnée. Œdèmes des membres inférieurs.",
                    "Insuffisance cardiaque congestive débutante", 0.81, StatutConsultation.ANALYSEE,
                    "ECG et échographie cardiaque demandés. Régime hyposodé. Diurétiques à discuter."
            ),
            new SymptomeDiagnostic(
                    "Anémie sévère. Pâleur cutanéo-muqueuse. Asthénie majeure. Alimentation carencée.",
                    "Anémie ferriprive sévère - Carence nutritionnelle", 0.91, StatutConsultation.CLOTUREE,
                    "NFS faite : Hb 6.2 g/dL. Supplémentation martiale. Éducation nutritionnelle."
            ),
            new SymptomeDiagnostic(
                    "Sensation de corps étranger oculaire. Rougeur unilatérale. Photophobie modérée.",
                    "Conjonctivite bactérienne aiguë", 0.95, StatutConsultation.CLOTUREE,
                    "Collyre antibiotique 7 jours. Consignes d'hygiène oculaire."
            ),
            new SymptomeDiagnostic(
                    "Toux avec hémoptysie minime. Amaigrissement rapide. Tabagisme chronique 25 PA. Douleur thoracique.",
                    "Carcinome bronchique suspecté - Bilan à compléter", 0.58, StatutConsultation.EN_ATTENTE,
                    "Radiographie thoracique. Scanner thoracique à programmer. Avis pneumologique."
            ),
            new SymptomeDiagnostic(
                    "Polyurie. Polydipsie. Polyphagie. Glycosurie à la BU. Perte de poids récente.",
                    "Diabète sucré inaugural - Type 2 probable", 0.85, StatutConsultation.ANALYSEE,
                    "Glycémie à jeun et HbA1c demandées. Éducation thérapeutique programmée."
            ),
            new SymptomeDiagnostic(
                    "Crise drépanocytaire. Douleurs osseuses diffuses. Pâleur. Notion de drépanocytose SS connue.",
                    "Crise vaso-occlusive drépanocytaire", 0.97, StatutConsultation.CLOTUREE,
                    "Hyperhydratation IV. Antalgiques palier 3. Oxygénothérapie. Surveillance rénale."
            ),
            new SymptomeDiagnostic(
                    "Otalgie droite. Hypoacousie. Otorrhée mucopurulente. Antécédent de rhinopharyngite récente.",
                    "Otite moyenne aiguë suppurée droite", 0.93, StatutConsultation.CLOTUREE,
                    "Antibiothérapie 8 jours. Paracétamol. Contrôle otoscopique dans 10 jours."
            )
    );

    private void creerConsultations(List<Patient> patients, List<User> users) {
        User agent = users.stream()
                .filter(u -> u.getRole() == RoleUser.AGENT)
                .findFirst().orElseThrow();
        User medecin = users.stream()
                .filter(u -> u.getRole() == RoleUser.MEDECIN)
                .findFirst().orElseThrow();

        List<Consultation> consultations = new ArrayList<>();
        List<SymptomeDiagnostic> shuffled = new ArrayList<>(SCENARIOS);
        Collections.shuffle(shuffled);

        LocalDateTime now = LocalDateTime.now();
        // 12 consultations par établissement, réparties sur 3 mois (90 jours)
        for (int i = 0; i < 12; i++) {
            SymptomeDiagnostic scenario = shuffled.get(i % shuffled.size());

            // Répartition uniforme sur les 90 derniers jours, avec quelques heures de variation
            long joursAlea = Math.round((i / 11.0) * 90);
            int heuresAlea = ThreadLocalRandom.current().nextInt(0, 23);
            LocalDateTime dateConsultation = now
                    .minusDays(joursAlea)
                    .withHour(heuresAlea)
                    .withMinute(ThreadLocalRandom.current().nextInt(0, 59));

            // Alternance patient et utilisateur pour diversifier
            Patient patient = patients.get(i % patients.size());
            User praticien = (i % 3 == 0) ? agent : medecin;

            Consultation consultation = Consultation.builder()
                    .date(dateConsultation)
                    .symptomes(scenario.symptomes)
                    .diagnosticIa(praticien == medecin && scenario.statut != StatutConsultation.EN_ATTENTE
                            ? scenario.diagnosticIa : null)
                    .scoreConfiance(praticien == medecin && scenario.statut != StatutConsultation.EN_ATTENTE
                            ? scenario.scoreConfiance : null)
                    .statut(scenario.statut)
                    .notes(scenario.notes)
                    .patient(patient)
                    .user(praticien)
                    .build();

            consultations.add(consultation);
        }

        // Ajout de 3 consultations très récentes pour garantir des données dans "ce mois"
        for (int i = 0; i < 3; i++) {
            SymptomeDiagnostic scenario = shuffled.get((shuffled.size() - 1 - i) % shuffled.size());
            Patient patient = patients.get(i % patients.size());

            Consultation recente = Consultation.builder()
                    .date(now.minusHours(ThreadLocalRandom.current().nextInt(1, 72)))
                    .symptomes(scenario.symptomes)
                    .diagnosticIa(scenario.diagnosticIa)
                    .scoreConfiance(scenario.scoreConfiance)
                    .statut(scenario.statut)
                    .notes(scenario.notes)
                    .patient(patient)
                    .user(medecin)
                    .build();
            consultations.add(recente);
        }

        consultationRepository.saveAll(consultations);
        log.info("{} : {} consultations créées (réparties sur 3 mois).",
                patients.get(0).getEtablissement().getNom(), consultations.size());
    }

    private record SymptomeDiagnostic(
            String symptomes,
            String diagnosticIa,
            double scoreConfiance,
            StatutConsultation statut,
            String notes
    ) {}

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
