# Rétrospective — Sprint 3 (CI/CD + Tests + Production Ready)

**Date** : 29 juillet 2026
**Projet** : SénSanté Pro — ESP/UCAD Master 1 IABD/GLSI
**Objectif** : Pipeline CI/CD complet, dashboard analytics, configuration production, robustesse

---

## 1. Ce qui a été livré

### Pipeline CI/CD à 4 stages

```
.github/workflows/
├── github-ci.yml    ← pipeline principal (PR → develop/main)
└── ci-cd.yml         ← pipeline complet (push main → déploiement)
```

| Stage | Nom | Déclencheur | Rôle |
|---|---|---|---|
| 1 | `test-backend` | push + PR | Tests Spring Boot avec PostgreSQL service container |
| 2 | `build` | push main | Build Docker backend + frontend, push GHCR |
| 3 | `build-frontend` | push + PR | Build Vite + vérification intégrité |
| 4 | `deploy-staging` | push main | SSH → serveur → `docker compose up -d` |

La variable `ANTHROPIC_AUTH_TOKEN` (secret GitHub) est injectée dans chaque job qui exécute des tests, et transmise au conteneur de production via `docker-compose.prod.yml`.

### Configuration production

`src/main/resources/application-prod.properties` :

- **Base de données** : PostgreSQL configuré depuis `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD` (variables d'environnement)
- **Hibernate** : `ddl-auto=validate` (vérifie la cohérence schéma/entités sans modifier la base)
- **Connection pool** : HikariCP avec 20 connexions max, 5 au repos, timeouts adaptés
- **Logging** : `root=WARN`, frameworks=`WARN`, applicatif=`INFO`
- **Swagger** : désactivé (`springdoc.api-docs.enabled=false`)
- **JWT** : secret depuis `JWT_SECRET` (pas de valeur en dur)
- **DeepSeek** : token depuis `ANTHROPIC_AUTH_TOKEN`

Le profil est activé via `SPRING_PROFILES_ACTIVE=prod` dans `docker-compose.prod.yml`.

### Dashboard analytics avec données réelles

Le `DataInitializer` génère désormais **45 consultations** (15 par établissement, 3 établissements) réparties sur **3 mois**, avec 20 scénarios médicaux réalistes couvrant les pathologies d'Afrique de l'Ouest :

paludisme, tuberculose, drépanocytose, hépatite E, pied diabétique, gastro-entérite, hypertension, insuffisance cardiaque, carcinome bronchique, otite, sinusite, lombosciatique, gale, conjonctivite, diabète inaugural, anémie ferriprive, ulcère gastroduodénal, convulsions fébriles, cystite, bronchite.

Les graphiques Recharts affichent :
- Consultations par région (barres)
- Consultations par statut (donut : EN_ATTENTE / ANALYSEE / CLOTUREE)
- Consultations des 6 derniers mois (courbe area)
- Consultations par mois (ligne)
- KPIs : total patients, total consultations, taux IA, taux clôture

### Corrections frontend

- **Register → login** : le formulaire d'inscription appelait `GET /api/etablissements` (protégé) → 401 → redirection vers login. Corrigé en créant `GET /api/auth/etablissements` (public) et en rendant l'intercepteur 401 intelligent (ne redirige pas depuis les pages publiques).
- **Bouton "Nouveau patient"** : aucun `onClick`. Ajout d'une modale avec formulaire complet (nom, prénom, date naissance, sexe, téléphone, adresse, région, établissement). Création via `patientService.create()` puis rafraîchissement de la liste.
- **Dashboard comme page d'accueil** : redirection post-login vers `/dashboard`, NavBar réorganisée, LandingPage redirige vers `/dashboard` si déjà connecté.

### Tests automatisés

| Classe | Type | Tests | Couverture |
|---|---|---|---|
| `DemoApplicationTests` | `@SpringBootTest` | 1 | Chargement du contexte complet (H2, mocks IA, DataInitializer) |
| `AuthControllerTest` | `@WebMvcTest` | 8 | Login : succès, email inconnu, mot de passe erroné, validation, sécurité |

`AuthControllerTest` est structuré en 4 groupes (@Nested) :
- **Cas nominaux** : 200 + token JWT quand les credentials sont valides
- **Cas d'erreur métier** : 404 si email absent ou mot de passe incorrect
- **Cas de validation** : 400 si email/password manquants ou format invalide
- **Cas de sécurité** : le endpoint est accessible sans token JWT (permitAll)

### Mise à niveau sécurité JJWT

Les trois dépendances JJWT sont alignées en **0.12.6** (correction de la vulnérabilité CVE signalée par l'IDE sur la 0.11.5). Le `JwtService` a été migré vers l'API 0.12.x :

- `Jwts.builder().setSubject()` → `.subject()`
- `Jwts.parserBuilder().setSigningKey()` → `Jwts.parser().verifyWith()`
- `parseClaimsJws().getBody()` → `parseSignedClaims().getPayload()`

---

## 2. Déroulement de la démo (20 min)

**Rôles** : Le Commandant présente, Le Stratège explique le pipeline.

| Min | Action | Qui | Ce qu'il faut montrer |
|---|---|---|---|
| 0-3 | Ouvrir GitHub Actions → l'onglet Actions | Le Commandant | Les 4 stages verts : test-backend, build, build-frontend, verify-pipeline. Le workflow `Pipeline CI/CD complete` avec le déploiement staging. |
| 3-6 | Ouvrir un job `test-backend` | Le Stratège | Les logs en direct : PostgreSQL qui démarre (healthcheck), `mvn test` qui passe, les 8 tests AuthControllerTest en vert, le rapport Surefire. |
| 6-8 | Onglet Tests (dorny/test-reporter) | Le Commandant | Les rapports JUnit formatés : 9 tests, 0 échec, 0 erreur. Chaque test avec son nom en français. |
| 8-11 | GitHub Container Registry | Le Stratège | Les deux images Docker : `backend:latest` et `frontend:latest`. Expliquer le multi-stage build (builder → runtime). |
| 11-14 | `docker pull` + `docker run` | Le Commandant | Récupérer l'image backend, la lancer localement avec PostgreSQL. Montrer que l'API répond sur le port 8080. |
| 14-18 | Dashboard SénSanté Pro | Le Commandant | Les 6 KPIs, les 5 graphiques Recharts avec les données réelles (45 consultations). Filtrer par établissement, naviguer entre les onglets. |
| 18-20 | Merge develop → main + tag v0.9 | Le Stratège | `git merge develop`, `git tag -a v0.9 -m "Sprint 3 : CI/CD + Tests + Prod ready"`, `git push --tags`. |

---

## 3. Réponses aux questions

### Pourquoi utilise-t-on un service PostgreSQL dans le job test ?

Les tests d'intégration (`@SpringBootTest`) chargent le contexte complet, y compris les repositories JPA. Plutôt que d'utiliser H2 en CI (qui ne reflète pas le comportement réel de PostgreSQL — syntaxe SQL, types de données, contraintes), on démarre un conteneur PostgreSQL 15 via les `services` GitHub Actions. C'est le même moteur qu'en production, donc les tests sont fidèles. Le healthcheck `pg_isready` garantit que la base est prête avant que les tests ne démarrent.

### Que se passe-t-il si un test échoue ? Le stage package s'exécute-t-il ?

Non. Le job `build-backend` a `needs: test-backend` dans sa définition. Si `test-backend` échoue, `build-backend` est automatiquement sauté par GitHub Actions. C'est intentionnel : on ne construit pas une image Docker à partir d'un code dont les tests ne passent pas. Le job `verify-pipeline` a `needs: [build-backend, test-backend, build-frontend]`, donc lui aussi est sauté si un seul job échoue. L'échec est visible en rouge dans l'onglet Actions avec le job fautif mis en évidence.

### Quelle est la différence entre l'image builder et l'image runtime ?

Le Dockerfile utilise un **multi-stage build** en deux étapes :

| | Stage 1 : builder | Stage 2 : runtime |
|---|---|---|
| Image de base | `maven:3.9-eclipse-temurin-21` (~600 Mo) | `eclipse-temurin:21-jre-alpine` (~180 Mo) |
| Contenu | JDK complet + Maven + dépendances + code source | JRE uniquement + `app.jar` compilé |
| Rôle | Compiler le projet (`mvn package`) | Exécuter l'application (`java -jar`) |
| Présence dans le registre | Non (image intermédiaire) | Oui (`backend:latest`) |

L'image finale ne contient que le JRE et le jar, pas Maven ni le code source, ce qui réduit drastiquement la taille et la surface d'attaque. L'utilisateur non-root `sensante` ajoute une couche de sécurité supplémentaire.

---

## 4. Dette technique résolue

| Item (Sprint 2) | Résolution |
|---|---|
| Bouton "Nouveau patient" non fonctionnel | Modale avec formulaire complet, création API, rafraîchissement liste |
| Dashboard statique (données factices) | 45 consultations réparties sur 3 mois, 20 scénarios, graphiques Recharts |
| Pas de tests | `AuthControllerTest` (8 cas), `DemoApplicationTests` (contexte complet) |
| Vulnérabilité JJWT | Migration 0.11.5 → 0.12.6 avec refactoring API |
| Pas de configuration production | `application-prod.properties` avec `ddl-auto=validate`, logs réduits |
| Pas de documentation tests | `docs/tests.md` : lancement local, CI, dépannage, templates |

---

## 5. Dette technique restante

| Item | Impact | Priorité |
|---|---|---|
| Token JWT en `window.__token` (volatil) | Perte de session au rechargement | Sprint 4 |
| Pas de refresh token | Session limitée à 24h | Sprint 4 |
| Pas de tests frontend (Vitest) | Aucune couverture React | Sprint 4 |
| `PatientForm.jsx` orphelin (code mort) | Confusion maintenance | Nettoyage |
| `EtablissementList.jsx` orphelin (code mort) | Confusion maintenance | Nettoyage |
| `LoadingSpinner.jsx` non utilisé | Code mort | Nettoyage |
| Secrets dans l'historique git (application.properties initial) | Sécurité | Action immédiate (`git filter-branch`) |

---

## 6. Leçons apprises

- **Spring Boot 4.1.0 déplace les paquets de test** : `@WebMvcTest` est passé de `org.springframework.boot.test.autoconfigure.web.servlet` vers `org.springframework.boot.webmvc.test.autoconfigure`. `@MockBean` est remplacé par `@MockitoBean` (Spring Framework 7.x). Ces changements cassent la compilation si on copie du code écrit pour Spring Boot 3.x.

- **L'alignement des versions JJWT est critique** : upgrader uniquement `jjwt-impl` sans `jjwt-api` produit un `NoClassDefFoundError` au runtime (`io.jsonwebtoken.security.SecureRequest`). Les trois artefacts (`jjwt-api`, `jjwt-impl`, `jjwt-jackson`) doivent être à la même version. La 0.12.x a une API significativement différente de la 0.11.x.

- **L'intercepteur 401 doit être conscient du contexte** : rediriger systématiquement vers `/login` sur une 401 casse les pages publiques qui appellent accidentellement un endpoint protégé. Vérifier `window.location.pathname` avant de rediriger évite les boucles.

- **`needs` est le filet de sécurité du pipeline** : sans `needs: test-backend`, le build se déclenche même si les tests échouent, ce qui peut déployer du code cassé en production.

- **Les services containers GitHub Actions sont éphémères** : le PostgreSQL du job `test-backend` est détruit à la fin du job. Les données de test n'existent que le temps du job. C'est idéal pour l'isolation : chaque exécution de pipeline part d'une base vierge.

- **Multi-stage Docker réduit l'image de 70%** : le stage builder inclut Maven + JDK (~600 Mo), le stage runtime n'a que le JRE + jar (~180 Mo). L'image plus légère se télécharge plus vite et a une surface d'attaque réduite.

---

## 7. Métriques

| Indicateur | Sprint 2 | Sprint 3 |
|---|---|---|
| Tests automatisés | 1 | 9 |
| Couverture de test | Contexte uniquement | Contexte + Web (AuthController) |
| Consultations de test | 12 (4/établissement) | 45 (15/établissement sur 3 mois) |
| Scénarios médicaux | 3 | 20 |
| Pipeline stages CI | 3 | 4 (+ déploiement staging) |
| Configuration environnements | 1 (dev) | 3 (dev, test, prod) |
| Vulnérabilités critiques | 1 (JJWT 0.11.5) | 0 |
| Documentation | 0 fichier test | `docs/tests.md` |
| Tags Git | v0.5 | v0.9 |
