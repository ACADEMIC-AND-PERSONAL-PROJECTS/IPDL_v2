<br>
<p align="center">
  <picture>
    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=32&duration=3000&pause=1000&color=0891B2&center=true&vCenter=true&width=800&lines=S%C3%A9nSant%C3%A9+Pro;Plateforme+de+Sant%C3%A9+Communautaire;Spring+Boot+%2B+React+%2B+IA" alt="SénSanté Pro" />
  </picture>
</p>

<p align="center">
  <a href="https://github.com/ACADEMIC-AND-PERSONAL-PROJECTS/IPDL_v2/actions"><img src="https://img.shields.io/github/actions/workflow/status/ACADEMIC-AND-PERSONAL-PROJECTS/IPDL_v2/ci-cd.yml?branch=main&style=for-the-badge&logo=githubactions&logoColor=white&label=CI/CD&color=0891B2" alt="CI/CD"></a>
  <a href="https://github.com/ACADEMIC-AND-PERSONAL-PROJECTS/IPDL_v2/blob/main/LICENSE"><img src="https://img.shields.io/github/license/ACADEMIC-AND-PERSONAL-PROJECTS/IPDL_v2?style=for-the-badge&color=0891B2" alt="License"></a>
  <img src="https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 21">
  <img src="https://img.shields.io/badge/Spring_Boot-4.1-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot 4.1">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19">
  <img src="https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL 15">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/Terraform-7B4299?style=for-the-badge&logo=terraform&logoColor=white" alt="Terraform">
  <img src="https://img.shields.io/badge/Spring_AI-2.0-6DB33F?style=for-the-badge&logo=spring&logoColor=white" alt="Spring AI 2.0">
</p>

---

## Contexte

SénSanté Pro est une plateforme de gestion de consultations médicales destinée
aux établissements de santé sénégalais. Elle permet aux agents, médecins et
administrateurs de suivre les patients, créer des consultations et obtenir des
diagnostics assistés par intelligence artificielle.

Ce projet est né dans le cadre du module IPDL2 — Introduction au Processus de
Développement Logiciel du Master 1 IABD/GLSI à l'École Supérieure
Polytechnique (ESP) de l'Université Cheikh Anta Diop de Dakar, sous la
direction du Dr. El Hadji Bassirou TOURÉ.

Conçu initialement comme un projet de groupe sur 4 sprints SCRUM, je l'ai repris
individuellement après la fin du module pour le ré-adapter en profondeur :
migration de GitLab CI vers GitHub Actions, adoption de Spring AI en
remplacement du `RestTemplate` Groq d'origine, conteneurisation Docker
complète, provisioning Terraform, et intégration du modèle DeepSeek
plutôt que Groq.

```mermaid
graph LR
    A[ Agent] -->|Crée| B[ Consultation]
    B -->|Déclenche| C[ Diagnostic IA]
    C -->|DeepSeek API| D[ Résultat]
    B -->|Assignée| E[ Médecin]
    E -->|Analyse| D
    D -->|Tableau de bord| F[ Analytics]
```

```mermaid
flowchart TD

subgraph group_experience["Web Experience"]
  node_react_app["React Application<br/>[App.jsx]"]
  node_dashboard_page["Dashboard Page<br/>[DashboardPage.jsx]"]
end

subgraph group_access["Identity Access"]
  node_auth_context["Auth Context<br/>[AuthContext.jsx]"]
  node_auth_service["Auth API Client<br/>[authService.js]"]
  node_auth_controller["Auth Controller"]
  node_auth_service_backend["Auth Service<br/>[AuthService.java]"]
  node_jwt_service["JWT Service<br/>[JwtService.java]"]
  node_security_filter["JWT Security Filter<br/>[JwtAuthFilter.java]"]
end

subgraph group_care["Patient Care"]
  node_patient_pages["Patient Pages<br/>[PatientsPage.jsx]"]
  node_patient_client["Patient API Client<br/>[patientsService.js]"]
  node_patient_controller["Patient Controllers"]
  node_establishment_controller["Establishment Controller"]
  node_patient_service["Patient Service"]
  node_consultation_pages["Consultation Pages"]
  node_consultation_client["Consultation API Client"]
  node_consultation_controller["Consultation Controller"]
  node_consultation_service["Consultation Service"]
end

subgraph group_intelligence["Clinical Intelligence"]
  node_ai_service["AI Service<br/>[AiService.java]"]
end

subgraph group_insights["Analytics Data"]
  node_patient_store[("Patient Database")]
  node_consultation_store[("Consultation Database")]
  node_analytics_client["Analytics API Client"]
  node_analytics_controller["Analytics Controller"]
  node_analytics_service["Analytics Service"]
end

node_professional(("Healthcare Professional"))
node_deepseek{{"DeepSeek API"}}
node_postgresql[("PostgreSQL")]

node_professional -->|"uses"| node_react_app
node_react_app -->|"provides auth"| node_auth_context
node_auth_context -->|"logs in"| node_auth_service
node_auth_service -->|"sends credentials"| node_auth_controller
node_auth_controller -->|"authenticates"| node_auth_service_backend
node_auth_service_backend -->|"creates JWT"| node_jwt_service
node_auth_service_backend -->|"reads users"| node_postgresql
node_security_filter -->|"validates JWT"| node_jwt_service
node_react_app -->|"routes patients"| node_patient_pages
node_patient_pages -->|"requests patients"| node_patient_client
node_patient_pages -->|"loads establishments"| node_establishment_controller
node_patient_client -->|"manages patients"| node_patient_controller
node_patient_controller -->|"delegates care"| node_patient_service
node_patient_service -->|"reads writes"| node_patient_store
node_patient_store -->|"persists patients"| node_postgresql
node_react_app -->|"routes consultations"| node_consultation_pages
node_consultation_pages -->|"submits consultations"| node_consultation_client
node_consultation_client -->|"manages consultations"| node_consultation_controller
node_consultation_controller -->|"delegates workflow"| node_consultation_service
node_consultation_service -->|"reads writes"| node_consultation_store
node_consultation_store -->|"persists consultations"| node_postgresql
node_consultation_service -->|"requests diagnosis"| node_ai_service
node_ai_service -.->|"analyzes symptoms"| node_deepseek
node_react_app -->|"routes dashboard"| node_dashboard_page
node_dashboard_page -->|"loads summary"| node_analytics_client
node_analytics_client -->|"requests metrics"| node_analytics_controller
node_analytics_controller -->|"builds summary"| node_analytics_service
node_analytics_service -->|"reads aggregates"| node_postgresql

click node_react_app "https://github.com/academic-and-personal-projects/ipdl_v2/blob/main/frontend/src/App.jsx"
click node_auth_context "https://github.com/academic-and-personal-projects/ipdl_v2/blob/main/frontend/src/contexts/AuthContext.jsx"
click node_auth_service "https://github.com/academic-and-personal-projects/ipdl_v2/blob/main/frontend/src/services/authService.js"
click node_auth_controller "https://github.com/academic-and-personal-projects/ipdl_v2/blob/main/src/main/java/com/example/demo/auth/controller/AuthController.java"
click node_auth_service_backend "https://github.com/academic-and-personal-projects/ipdl_v2/blob/main/src/main/java/com/example/demo/auth/service/AuthService.java"
click node_jwt_service "https://github.com/academic-and-personal-projects/ipdl_v2/blob/main/src/main/java/com/example/demo/auth/service/JwtService.java"
click node_security_filter "https://github.com/academic-and-personal-projects/ipdl_v2/blob/main/src/main/java/com/example/demo/auth/JwtAuthFilter.java"
click node_patient_pages "https://github.com/academic-and-personal-projects/ipdl_v2/blob/main/frontend/src/pages/PatientsPage.jsx"
click node_patient_client "https://github.com/academic-and-personal-projects/ipdl_v2/blob/main/frontend/src/services/patientsService.js"
click node_patient_controller "https://github.com/academic-and-personal-projects/ipdl_v2/blob/main/src/main/java/com/example/demo/patient/controller/PatientController.java"
click node_establishment_controller "https://github.com/academic-and-personal-projects/ipdl_v2/blob/main/src/main/java/com/example/demo/patient/controller/EtablissementController.java"
click node_patient_service "https://github.com/academic-and-personal-projects/ipdl_v2/blob/main/src/main/java/com/example/demo/patient/service/PatientService.java"
click node_patient_store "https://github.com/academic-and-personal-projects/ipdl_v2/blob/main/src/main/java/com/example/demo/patient/repository/PatientRepository.java"
click node_consultation_pages "https://github.com/academic-and-personal-projects/ipdl_v2/blob/main/frontend/src/pages/ConsultationsPage.jsx"
click node_consultation_client "https://github.com/academic-and-personal-projects/ipdl_v2/blob/main/frontend/src/services/consultationsService.js"
click node_consultation_controller "https://github.com/academic-and-personal-projects/ipdl_v2/blob/main/src/main/java/com/example/demo/consultation/controller/ConsultationController.java"
click node_consultation_service "https://github.com/academic-and-personal-projects/ipdl_v2/blob/main/src/main/java/com/example/demo/consultation/service/ConsultationService.java"
click node_consultation_store "https://github.com/academic-and-personal-projects/ipdl_v2/blob/main/src/main/java/com/example/demo/consultation/repository/ConsultationRepository.java"
click node_ai_service "https://github.com/academic-and-personal-projects/ipdl_v2/blob/main/src/main/java/com/example/demo/ia/service/AiService.java"
click node_dashboard_page "https://github.com/academic-and-personal-projects/ipdl_v2/blob/main/frontend/src/pages/DashboardPage.jsx"
click node_analytics_client "https://github.com/academic-and-personal-projects/ipdl_v2/blob/main/frontend/src/services/analyticsService.js"
click node_analytics_controller "https://github.com/academic-and-personal-projects/ipdl_v2/blob/main/src/main/java/com/example/demo/analytics/controller/AnalyticsController.java"
click node_analytics_service "https://github.com/academic-and-personal-projects/ipdl_v2/blob/main/src/main/java/com/example/demo/analytics/service/AnalyticsService.java"

classDef toneNeutral fill:#f8fafc,stroke:#334155,stroke-width:1.5px,color:#0f172a
classDef toneBlue fill:#dbeafe,stroke:#2563eb,stroke-width:1.5px,color:#172554
classDef toneAmber fill:#fef3c7,stroke:#d97706,stroke-width:1.5px,color:#78350f
classDef toneMint fill:#dcfce7,stroke:#16a34a,stroke-width:1.5px,color:#14532d
classDef toneRose fill:#ffe4e6,stroke:#e11d48,stroke-width:1.5px,color:#881337
classDef toneIndigo fill:#e0e7ff,stroke:#4f46e5,stroke-width:1.5px,color:#312e81
classDef toneTeal fill:#ccfbf1,stroke:#0f766e,stroke-width:1.5px,color:#134e4a
class node_react_app,node_dashboard_page toneBlue
class node_auth_context,node_auth_service,node_auth_controller,node_auth_service_backend,node_jwt_service,node_security_filter,node_postgresql toneAmber
class node_patient_pages,node_patient_client,node_patient_controller,node_establishment_controller,node_patient_service,node_consultation_pages,node_consultation_client,node_consultation_controller,node_consultation_service,node_deepseek toneMint
class node_ai_service toneRose
class node_patient_store,node_consultation_store,node_analytics_client,node_analytics_controller,node_analytics_service,node_professional toneIndigo
```

## Stack technique

| Couche | Technologie |
|:---|:---|
| Backend | Spring Boot 4.1, Java 21, Spring Security 6, JWT (JJWT 0.12.6), Spring AI 2.0 |
| Frontend | React 19, Vite 8, Tailwind CSS, Axios, Recharts |
| Base de données | PostgreSQL 15 (dev & prod), H2 (tests) |
| IA | DeepSeek V4 Flash (via Spring AI OpenAI-compatible) |
| CI/CD | GitHub Actions — 5 jobs : tests, terraform plan, terraform apply, déploiement SSH |
| Conteneurisation | Docker multi-stage, Docker Compose (dev & prod) |
| IaC | Terraform 1.6 + provider Docker |
| Monitoring | Spring Boot Actuator (health endpoint) |

## Quick start

### Développement local

```bash
# 1. Base de données
docker compose up -d postgres

# 2. Backend (port 8080)
./mvnw spring-boot:run

# 3. Frontend (port 5173)
cd frontend && npm install && npm run dev
```

L'application est accessible sur `http://localhost:5173`. Le proxy Vite redirige
`/api/*` vers le backend. Comptes de test pré-initialisés :

| Rôle | Email | Mot de passe |
|:---|:---|---|
| Admin | `admin.dakar@sensante.sn` | `test123` |
| Médecin | `medecin.dakar@sensante.sn` | `test123` |
| Agent | `agent.dakar@sensante.sn` | `test123` |

### Production / Staging

```bash
# Copier et remplir les variables d'environnement
cp .env.example .env

# Build + démarrage
docker compose -f docker-compose.prod.yml up -d --build
```

### Terraform (alternative)

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars   # remplir les secrets
terraform init
terraform plan
terraform apply
```

## Aperçu

<p align="center">
  <sub>Landing Page — Page d'accueil publique</sub><br>
  <img src="assets/01-landing.png" width="80%" alt="Landing Page">
</p>

<p align="center">
  <sub>Connexion — Authentification JWT sécurisée</sub><br>
  <img src="assets/02-login.png" width="80%" alt="Login">
</p>

<p align="center">
  <sub>Tableau de bord — Analytics, graphiques, KPI par région et établissement</sub><br>
  <img src="assets/04-dashboard.png" width="80%" alt="Dashboard">
</p>

<details>
<summary> Plus de captures (Patients, Consultations, Inscription)</summary>

<p align="center">
  <sub>Patients — 6 patients pré-initialisés sur 3 établissements</sub><br>
  <img src="assets/05-patients.png" width="80%" alt="Patients">
</p>

<p align="center">
  <sub>Consultations — 45 consultations avec diagnostic IA</sub><br>
  <img src="assets/06-consultations.png" width="80%" alt="Consultations">
</p>

<p align="center">
  <sub>Inscription — Création de compte avec sélection d'établissement</sub><br>
  <img src="assets/03-register.png" width="80%" alt="Register">
</p>

</details>

## Structure du projet

```
IPDL_v2/
├── .github/workflows/
│   ├── ci-cd.yml              # Pipeline CI/CD complet (tests + terraform + deploy)
│   └── github-ci.yml          # Pipeline secondaire (PRs develop/main)
├── docs/
│   └── terraform.md           # Guide Terraform détaillé
├── frontend/                  # Application React 19 + Vite 8
│   ├── src/
│   │   ├── components/        # NavBar, Badge, DiagnosticIA, RouteProtegee…
│   │   ├── contexts/          # AuthContext (JWT management)
│   │   ├── pages/             # Landing, Login, Register, Dashboard, Patients, Consultations
│   │   └── services/          # Axios client, intercepteurs JWT
│   ├── Dockerfile             # Build multi-stage Node → Nginx
│   └── nginx.conf             # Reverse proxy /api → backend
├── src/main/java/com/example/demo/
│   ├── analytics/             # Statistiques (controller, service, DTO)
│   ├── auth/                  # Authentification JWT (login, register, filter)
│   ├── config/                # SecurityConfig, CorsConfig, DataInitializer, AiConfig
│   ├── consultation/          # CRUD consultations + diagnostic IA
│   ├── ia/                    # Service IA (DeepSeek via Spring AI)
│   └── patient/               # CRUD patients + établissements
├── terraform/                 # Infrastructure as Code
│   ├── main.tf                # 3 conteneurs (postgres, backend, frontend)
│   ├── variables.tf           # 8 variables dont 3 sensibles
│   └── outputs.tf             # URLs et IDs exposés
├── docker-compose.yml         # Environnement dev (postgres + pgadmin)
├── docker-compose.prod.yml    # Environnement prod (postgres + backend + frontend)
├── Dockerfile                 # Build multi-stage Spring Boot
├── init.sql                   # Schéma PostgreSQL pour déploiement frais
└── .env.example               # Modèle de variables d'environnement
```

## Pipeline CI/CD

```mermaid
graph TD
    P[Push sur main] --> TB[Tests Backend<br/>Maven + JUnit]
    TB --> TP[Terraform Plan<br/>init → plan → upload artefact]
    TP --> TA[Terraform Apply<br/> Manuel - environment production]
    TB --> D[Deploy VPS<br/>SSH → git pull → docker compose up -d]
```

Le pipeline GitHub Actions déclenche automatiquement les tests et le plan
Terraform à chaque push sur `main`. Le `terraform apply` et le déploiement VPS
sont déclenchés manuellement via l'environnement protégé `production`.

## Sprints SCRUM — Parcours académique

Le projet a été développé en suivant la méthodologie SCRUM sur 4 sprints :

| Sprint | Thématique | Livrables |
|:---|:---|:---|
| Sprint 0 | Setup & Environnement | Spring Boot, Git/GitLab Flow, CI/CD initial, JPA |
| Sprint 1 | Cœur de métier | Authentification JWT, CRUD Patients, CRUD Consultations |
| Sprint 2 | IA & Frontend | Intégration IA (Groq→DeepSeek), React, Dashboard |
| Sprint 3 | Analytics & CI/CD | Graphiques, Pipeline 4 stages, Docker multi-stage |
| Sprint 4 | Hardening & Livraison | Docker Compose, Terraform IaC, Microservices (découverte) |

## Schéma de base de données

```mermaid
erDiagram
    ETABLISSEMENTS ||--o{ USERS : "employe"
    ETABLISSEMENTS ||--o{ PATIENTS : "accueille"
    PATIENTS ||--o{ CONSULTATIONS : "consulte"
    USERS ||--o{ CONSULTATIONS : "traite"

    ETABLISSEMENTS {
        bigint id PK
        string nom
        string type_etablissement "HOPITAL | CENTRE_SANTE | POST_SANTE"
        string region
        string telephone
        string adresse
    }

    USERS {
        bigint id PK
        string nom
        string prenom
        string email UK
        string password
        string role "AGENT | MEDECIN | ADMIN"
        bigint etablissement_id FK
    }

    PATIENTS {
        bigint id PK
        string nom
        string prenom
        date date_naissance
        string sexe "MASCULIN | FEMININ"
        string telephone
        string adresse
        string region
        string numero_dossier UK
        bigint etablissement_id FK
    }

    CONSULTATIONS {
        bigint id PK
        timestamp date
        text symptomes
        text diagnostic_ia
        double score_confiance
        string statut "EN_ATTENTE | ANALYSEE | CLOTUREE"
        text notes
        bigint patient_id FK
        bigint user_id FK
    }
```

## Compétences acquises

Ce projet a été une montée en compétence massive sur l'ensemble de la chaîne
DevOps et développement full-stack.

Git & GitHub. J'ai considérablement renforcé mon niveau. Git Flow, merge
requests, rebase interactif, résolution de conflits complexes, protection de
branches : tout le workflow collaboratif est maîtrisé. GitHub Actions est
devenu un réflexe, pas juste un outil de cours.

Spring Boot. J'avais de très solides fondations sur le framework, mais ce
projet m'a fait monter d'un cran supplémentaire. Sécurité JWT stateless,
architecture en couches, gestion des exceptions globale, validation,
projections JPA pour analytics, intégration de Spring AI avec le modèle
DeepSeek : je maîtrise désormais l'écosystème à un niveau professionnel.

GitHub Actions. J'avais des connaissances minimales au départ, je repars
avec une compétence opérationnelle solide. Pipeline CI/CD complet avec 5 jobs,
parallélisme, artefacts, environnements protégés, secrets.

Méthodologie SCRUM. Pour la première fois, j'ai mené un projet en
utilisant une méthodologie de gestion de projet structurée. J'ai très bien
saisi le rythme des sprints, la répartition des rôles (Stratège, Commandant,
Architecte Web), les cérémonies et les rétrospectives.

Lecture de documentation officielle. J'ai appris à lire la documentation
officielle d'une technologie plutôt que de m'attarder sur des vidéos très
longues. Aller directement à la source (Spring docs, HashiCorp docs, GitHub
Actions docs) m'a fait gagner un temps et une précision incomparables.

Docker & Terraform. J'ai poussé la conteneurisation multi-stage complète
(Spring Boot côté serveur, React/Nginx côté client) et découvert
l'Infrastructure as Code avec provisionnement Docker, gestion d'état et
variables sensibles.

## Perspectives — Version 2

Je compte ajouter un nouvel incrément jusqu'à aboutir à une version 2 incluant
un agent IA autonome capable d'interagir directement avec la base de données
et d'exécuter des actions :

- Agent conversationnel intégré au dashboard avec mémoire contextuelle
- Protocole MCP (Model Context Protocol) : l'agent IA pourra appeler des
  Tools pour interroger directement la base de données, exécuter des
  actions et présenter les résultats, sans passer par du SQL généré

---

<p align="center">
  <sub>Built with Java, React and DeepSeek AI — Dakar, 2026</sub>
</p>
