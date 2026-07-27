# Rétrospective — Sprint 1 (Backend Core)

**Projet :** SénSanté Pro  
**Date :** 27 juillet 2026  
**Durée du Sprint :** 3 labs (Auth, Patients, Consultations) — ~6h30  
**Facilitateur :** Le Stratège  
**Membres présents :** Le Stratège, Le Commandant, Le Forgeron, Le Tisserand, L'Architecte Web  

---

## Rappel de l'objectif du Sprint 1

Livrer une API REST fonctionnelle avec authentification JWT, CRUD patients et CRUD consultations. Chaque endpoint est protégé par Spring Security. La base de données est opérationnelle avec Docker Compose. Le frontend React dispose de pages fonctionnelles connectées à l'API.

**Tags livrés :** `v0.3` (Auth), `v0.4` (Patients), `v0.5` (Consultations — en cours)

---

## 1. Ce qui a bien marché

### Le Stratège (DevOps / CI/CD)

Le GitLab Flow est désormais un réflexe pour toute l'équipe. Les branches `main` et `develop` sont protégées, chaque fonctionnalité passe par une branche `feature/xxx` et une Merge Request. Le pipeline GitHub Actions a été enrichi avec un stage `test-backend` dédié, exécutant `mvn test` avec un conteneur PostgreSQL 15 isolé avant le build. Le fichier `.github-ci.yml` est documenté et les jobs sont correctement séquencés. L'équipe applique la règle du pipeline vert sans exception.

### Le Commandant (Product Owner)

Les 8 User Stories du Product Backlog sont clairement définies et priorisées. Le Sprint Planning du début de Sprint 1 a permis à chaque membre de confirmer son périmètre sans ambiguïté. Les critères d'acceptation pour US-01 (Auth), US-02 (Patients) et US-03 (Consultations) sont validés. La documentation des données de test dans `docs/users-test.md` est exhaustive : 3 établissements, 9 utilisateurs, 6 patients et 12 consultations documentés avec leurs scénarios cliniques.

### Le Forgeron (Auth / Spring Security)

L'authentification JWT est 100 % fonctionnelle. Les endpoints `/api/auth/register` et `/api/auth/login` retournent un token signé avec la clé secrète configurée. Les mots de passe sont hashés en BCrypt. Spring Security bloque tous les endpoints par défaut — une requête sans token reçoit systématiquement un 401. Le `SecurityContextHolder` est correctement exploité par le service de consultation pour identifier l'agent connecté. La configuration `CorsConfig` autorise le frontend Vite sur le port 5173.

### Le Tisserand (Entités JPA / Consultations)

Les quatre entités JPA — `User`, `Patient`, `Consultation`, `Etablissement` — sont correctement modélisées avec leurs relations `@ManyToOne`. Le `DataInitializer` (CommandLineRunner) peuple automatiquement la base de test au démarrage avec des données cohérentes et des scénarios médicaux réalistes en français. Le `ConsultationRepository` expose des requêtes dérivées utiles (`findByPatientIdOrderByDateDesc`, `findByUserEmailOrderByDateDesc`, `findByStatut`). Le bug de mapping `@JoinColumn(name = "medecin_id")` → `user_id` a été identifié et corrigé rapidement pendant le lab.

### L'Architecte Web (Frontend React)

La SPA React est fonctionnelle avec 5 pages : Login, Dashboard, Patients (liste), PatientForm (création), et ConsultationsPage (sélection patient + formulaire + historique avec badges de statut colorés). Les services Axios (`authService`, `patientsService`, `consultationsService`) suivent un pattern cohérent avec injection manuelle du header JWT via `getAuthHeader()`. La page `ConsultationsPage` affiche les statuts avec des badges colorés (jaune EN_ATTENTE, bleu ANALYSEE, vert CLOTUREE) et recharge la liste après création. Le `AuthContext` fournit token, user, login, register, logout et getAuthHeader à toute l'application via React Context.

---

## 2. Ce qui peut s'améliorer

### Le Stratège

Le pipeline GitHub Actions a connu un faux départ : le job `test-backend` créait une base `demo_test` dans le conteneur PostgreSQL alors que `application.properties` pointe vers `demo_pro`, provoquant une erreur `FATAL: database "demo_pro" does not exist` au démarrage du contexte Spring. La correction (passer `-Dspring.datasource.url=...` dans `mvn test`) est en place, mais le `build-backend` ne devrait pas avoir besoin de son propre conteneur PostgreSQL s'il skip les tests — le service PostgreSQL du job `build-backend` est superflu. Le `pg_isready` check utilise `-U postgres` alors que l'utilisateur configuré est `demo_user`, ce qui fonctionne par coïncidence (le conteneur a aussi un utilisateur `postgres`) mais manque de rigueur. Le pipeline n'a pas encore de stage `deploy` ni de build Docker.

### Le Commandant

Le Product Backlog (`docs/backlog.md`) a bien 8 User Stories mais les statuts ne sont pas à jour : US-03 est marquée "To Do" alors que les consultations sont implémentées. Les critères d'acceptation ne sont pas formalisés dans le backlog (pas de scénario Given/When/Then). La documentation `docs/users-test.md` est complète mais il manque un document décrivant l'architecture globale du projet (diagramme de classes, flux d'authentification, stack technique). Les endpoints REST ne sont pas tous documentés dans un fichier unique — il faut ouvrir Swagger UI ou lire les contrôleurs.

### Le Forgeron

Le mot de passe `test123` est codé en dur dans `DataInitializer.java`. La clé secrète JWT est en clair dans `application.properties` (`jwt.secret=sensante-pro-secret-key-esp-ucad-dakar-2025-minimum-256-bits`). Ces deux points sont acceptables en développement mais deviendront des problèmes de sécurité au Sprint 3 quand on approchera de la mise en production. Les rôles (AGENT, MEDECIN, ADMIN) ont actuellement les mêmes permissions sur la plupart des endpoints — la matrice RBAC n'est pas encore granulée (un ADMIN peut créer des consultations, ce qui n'est pas son rôle). Il n'y a pas de mécanisme de refresh token.

### Le Tisserand

Le `DataInitializer` insère les consultations directement via `ConsultationRepository` en contournant `ConsultationService` parce que ce dernier dépend du `SecurityContextHolder` (contexte JWT absent au démarrage). Cette duplication de logique (construction manuelle des objets Consultation) est fragile : si les règles métier changent dans le service, le DataInitializer ne les appliquera pas. L'entité `AuditLog` documentée dans `consultation-notes.md` n'est pas encore implémentée. Le `@Builder.Default` sur le champ `statut` a été ajouté après coup suite à un avertissement Lombok — ce genre de détail devrait être capturé plus tôt. Aucun test d'intégration n'existe pour les repositories.

### L'Architecte Web

La navigation est manuelle via `useState("page")` dans `App.jsx` — sans `react-router-dom`, il n'y a pas d'URL, pas de deep linking, pas de back/forward navigateur. Le token JWT et les informations utilisateur sont stockés uniquement dans le state React : un rafraîchissement de page déconnecte l'utilisateur. Tailwind CSS est installé (`package.json`) mais n'est pas configuré dans `vite.config.js` — tout le style est en inline CSS, ce qui devient difficile à maintenir au-delà de 5 pages. Il n'y a pas de composant réutilisable pour les badges de statut, les cartes patient, ou les messages d'erreur/succès — chaque page duplique le même JSX. Aucun test unitaire ou de composant n'existe côté frontend.

---

## 3. Actions concrètes pour le Sprint 2

### Action 1 — Stabiliser le pipeline CI/CD et préparer Docker (Le Stratège)

- [ ] Supprimer le service PostgreSQL redondant du job `build-backend` (il ne fait que `package -DskipTests`)
- [ ] Corriger le `pg_isready -U postgres` → `-U demo_user` dans les health-checks
- [ ] Ajouter un stage `docker-build` qui construit l'image Docker du backend Spring Boot
- [ ] Ajouter un stage `lint-backend` avec Checkstyle ou SpotBugs
- [ ] Externaliser `spring.datasource.url` en variable d'environnement `SPRING_DATASOURCE_URL` pour que le pipeline et le Docker Compose local utilisent le même mécanisme

**Responsable :** Le Stratège  
**US liée :** US-07 (Pipeline CI/CD)

### Action 2 — Formaliser la matrice de rôles et sécuriser la configuration (Le Forgeron)

- [ ] Granuler les `@PreAuthorize` : seul AGENT et MEDECIN créent des consultations, seul MEDECIN clôture, seul ADMIN supprime
- [ ] Externaliser `jwt.secret` dans une variable d'environnement `JWT_SECRET` (avec une valeur par défaut pour le dev uniquement)
- [ ] Remplacer le mot de passe codé en dur `test123` dans `DataInitializer` par une propriété `app.test-password` (lue depuis `application.properties`)
- [ ] Ajouter un endpoint `POST /api/auth/refresh` avec rotation de refresh token

**Responsable :** Le Forgeron  
**US liée :** US-01 (Auth)

### Action 3 — Implémenter AuditLog et couvrir les repositories par des tests (Le Tisserand)

- [ ] Créer l'entité `AuditLog` avec les champs documentés dans `consultation-notes.md`
- [ ] Ajouter un `AuditLogRepository` et un aspect `@Aspect` qui intercepte les mutations sur Patient et Consultation
- [ ] Écrire des tests d'intégration `@DataJpaTest` pour `ConsultationRepository`, `PatientRepository` et `AuditLogRepository`
- [ ] Refactorer `DataInitializer` pour utiliser `ConsultationService` directement (en mockant le SecurityContext via `@WithMockUser` ou en extrayant la logique de création dans une méthode sans dépendance auth)

**Responsable :** Le Tisserand  
**US liée :** US-03 (Consultations), US-08 (AuditLog)

### Action 4 — Intégrer react-router-dom et professionnaliser le frontend (L'Architecte Web)

- [ ] Installer et configurer `react-router-dom` avec 4 routes : `/login`, `/dashboard`, `/patients`, `/consultations`
- [ ] Persister le token JWT dans `localStorage` pour survivre au rafraîchissement de page
- [ ] Extraire des composants réutilisables : `StatusBadge`, `ErrorBanner`, `SuccessBanner`, `PatientCard`, `LoadingSpinner`
- [ ] Configurer Tailwind CSS dans `vite.config.js` et migrer les styles inline vers des classes utilitaires
- [ ] Ajouter un fichier `src/services/apiClient.js` (instance Axios partagée avec `baseURL` et interception automatique du token)

**Responsable :** L'Architecte Web  
**US liée :** US-05 (Interface web)

### Action 5 — Mettre à jour la documentation produit et technique (Le Commandant)

- [ ] Mettre à jour les statuts du Product Backlog dans `docs/backlog.md` (US-03 → Done)
- [ ] Ajouter les critères d'acceptation au format Given/When/Then pour chaque User Story du Sprint 2
- [ ] Créer `docs/architecture.md` : diagramme de classes, flux JWT, stack technique, schéma de déploiement
- [ ] Créer `docs/api-endpoints.md` : tableau exhaustif de tous les endpoints avec méthode, URL, rôle requis, body, réponse
- [ ] Préparer la Sprint Review du Sprint 1 : démonstration live de l'API via Swagger UI + démo frontend

**Responsable :** Le Commandant  
**US liée :** US-04, US-06 (préparation)

---

## Synthèse des décisions

| Décision | Issue |
|---|---|
| Toute configuration sensible (JWT secret, DB password) est externalisée en variable d'environnement avant le Sprint 3 | Sécurité |
| `react-router-dom` est intégré au début du Sprint 2 avant toute nouvelle page | Frontend |
| Chaque repository JPA aura au moins 2 tests d'intégration avant la fin du Sprint 2 | Qualité |
| Le pipeline CI doit être 100 % vert sur `main` et `develop` — aucun merge sans pipeline vert | DevOps |
| Le Product Backlog est mis à jour à chaque fin de lab, pas seulement en fin de Sprint | Processus |
| Les composants React réutilisables sont extraits avant d'ajouter de nouvelles pages | Frontend |

---

## Prochaines étapes

- **Sprint 2 — Kickoff :** Sprint Planning facilité par Le Stratège, présentation des US-04, US-05, US-06 par Le Commandant
- **Lab IA (US-04) :** Le Tisserand pilote l'intégration du module d'analyse IA des symptômes
- **Lab Frontend (US-05) :** L'Architecte Web pilote la migration vers react-router-dom et l'enrichissement de l'interface
- **Lab Dashboard (US-06) :** Le Commandant pilote les indicateurs et statistiques

---