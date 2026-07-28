# Rétrospective — Sprint 2 (Lab React 2 : Axios + JWT + AuthContext)

**Date** : 28 juillet 2026
**Projet** : SénSanté Pro — ESP/UCAD Master 1 IABD/GLSI
**Objectif** : Intégration frontend-backend, authentification JWT, appels API réels, analyse IA Groq

## 1. Ce qui a été livré

### Architecture frontend

```
frontend/src/
├── components/
│   ├── NavBar.jsx          ← navigation + logout réel (useAuth)
│   ├── PatientCard.jsx     ← carte patient réutilisable
│   ├── Badge.jsx           ← statuts EN_ATTENTE / ANALYSEE / CLOTUREE
│   ├── DiagnosticIA.jsx    ← affichage résultat IA (score + disclaimer)
│   └── RouteProtegee.jsx   ← garde de route (redirection login si non connecté)
├── pages/
│   ├── LoginPage.jsx       ← formulaire email/password, gestion erreur
│   ├── PatientsPage.jsx    ← liste depuis API, recherche filtrante
│   ├── ConsultationsPage.jsx ← création consultation + résultat IA + historique
│   └── DashboardPage.jsx   ← stats (placeholder Sprint 3)
├── services/
│   ├── api.js              ← instance Axios partagée, intercepteurs JWT + 401
│   ├── authService.js      ← login/register
│   ├── patientsService.js  ← CRUD patients
│   └── consultationsService.js ← création + recherche + clôture
├── contexts/
│   └── AuthContext.jsx     ← état global auth, login/logout, useNavigate
├── App.jsx                 ← routing avec RouteProtegee
└── main.jsx                ← BrowserRouter > AuthProvider > App
```

### Fonctionnalités

- Authentification JWT complète (login → token → stockage mémoire → injection automatique)
- Liste des patients chargée depuis l'API Spring Boot (POSTGRESQL)
- Création de consultation avec analyse IA Groq (DeepSeek)
- Affichage du diagnostic IA avec score de confiance coloré et disclaimer médical
- Historique des consultations avec statuts
- Protection des routes (redirection vers /login si non authentifié)
- Gestion globale des 401 (token expiré → redirection login)
- Barre de navigation avec liens actifs, email/rôle, déconnexion
- Pipeline CI/CD : build frontend (npm ci + npm run build) + artefact dist/

## 2. Déroulement de la démo (20 min)

| Étape | Action | Ce qu'il faut montrer |
|---|---|---|
| 1 | Ouvrir `http://localhost:5173` | Page de login avec dégradé bleu, formulaire centré |
| 2 | Se connecter avec `fatou.diallo@hopital.sn` / mot de passe | Redirection automatique vers `/patients`, NavBar affiche l'email et le rôle MEDECIN |
| 3 | Liste des patients | Patients chargés depuis le backend (noms réels, numéros de dossier SP-*) |
| 4 | Aller dans Consultations | Sélectionner un patient, décrire des symptômes réalistes (ex. fièvre, céphalées, douleurs abdominales) |
| 5 | Cliquer "Créer et analyser" | Bouton désactivé avec "Analyse IA en cours...", puis résultat IA affiché avec score et disclaimer |
| 6 | Voir "Mes consultations" | La nouvelle consultation apparaît avec statut ANALYSEE |
| 7 | Déconnexion | Redirection vers /login. Tenter d'accéder à `/patients` directement → redirigé vers login |

### Exemple de symptômes pour la démo

> "Patiente de 28 ans, fièvre à 39°C depuis 3 jours, céphalées frontales intenses, myalgies diffuses, réside à Pikine. Pas de nausées ni vomissements."

Le diagnostic IA devrait évoquer un paludisme ou une fièvre typhoïde (pathologies fréquentes en Afrique de l'Ouest), avec un score de confiance autour de 0.70-0.85.

## 3. Réponses aux questions de l'enseignant

### Que se passe-t-il si on recharge la page ? Pourquoi ?

Le token JWT est stocké dans `window.__token` (mémoire JavaScript), pas dans `localStorage`. Un rechargement de page réinitialise la mémoire → le token est perdu → `estConnecte` passe à `false` → `RouteProtegee` redirige vers `/login`. C'est un choix délibéré : ne pas persister le token dans le navigateur évite les attaques XSS par vol de token. Le compromis est que l'utilisateur doit se reconnecter après un rechargement. Une amélioration possible serait de stocker le token dans un cookie httpOnly géré par le backend.

### Comment le backend sait-il quel agent a créé la consultation ?

Le backend décode le JWT envoyé dans l'en-tête `Authorization: Bearer <token>`. Le token contient l'email et le rôle de l'agent dans ses claims (voir `JwtService.java:28-36`). Le `JwtAuthFilter` extrait ces informations et les place dans le `SecurityContext`. Le contrôleur de consultation récupère l'agent authentifié via `SecurityContextHolder.getContext().getAuthentication()` et l'associe à la consultation créée.

### Pourquoi le disclaimer apparaît-il systématiquement ?

Le disclaimer ("Ceci n'est pas un diagnostic médical. Consultez un professionnel de santé qualifié.") est une exigence légale et éthique. L'IA (DeepSeek/Groq) fournit une analyse à titre informatif uniquement. Le disclaimer est ajouté côté frontend dans `ConsultationsPage.jsx` lors de l'affichage du résultat, et le prompt système dans `AiConfig.java` rappelle également au modèle de ne pas fournir de posologie ni de traitement précis. C'est une protection contre le risque médico-légal.

## 4. Dette technique identifiée

| Item | Impact | Priorité |
|---|---|---|
| Token en `window.__token` (volatil au rechargement) | UX dégradée | Sprint 3 |
| Pas de refresh token JWT | Session courte (24h par défaut) | Sprint 3 |
| Pas de formulaire de création de patient (bouton présent mais non fonctionnel) | Périmètre incomplet | Sprint 3 |
| Dashboard statique (données factices) | Pas de valeur réelle | Sprint 3 |
| `application.properties` contient des secrets dans l'historique git | Sécurité | Action immédiate (voir `../docs/secrets.md`) |
| Pas de tests frontend (Jest/Vitest) | Qualité | Sprint 3 |

## 5. Prochaine étape — Sprint 3

- Persistance du token (cookie httpOnly ou localStorage + refresh)
- Formulaire de création de patient fonctionnel
- Dashboard avec graphiques réels (nombre de consultations, répartition par région)
- Clôture de consultation avec notes finales
- Formulaire d'inscription (register)
- Tests unitaires React (Vitest + React Testing Library)
- Déploiement du frontend (servir `dist/` via Nginx ou via Spring Boot static resources)

## 6. Leçons apprises

- L'intercepteur Axios centralise la logique JWT et évite de la répéter dans chaque service. Une seule modification suffit si le mécanisme d'auth change.
- `RouteProtegee` + `useNavigate` impose de placer `BrowserRouter` au-dessus de `AuthProvider` dans l'arbre React. L'erreur "useNavigate() may be used only in the context of a Router" a été rencontrée et corrigée en déplaçant le routeur dans `main.jsx`.
- Le copier-coller depuis LaTeX insère des espaces parasites autour des tirets dans les classes Tailwind. Un passage de nettoyage systématique est nécessaire.
- `npm ci` est préférable à `npm install` dans le pipeline CI car il respecte strictement le `package-lock.json` et est plus rapide.
