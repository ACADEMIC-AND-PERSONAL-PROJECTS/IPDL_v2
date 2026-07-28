    # Frontend — SénSanté Pro

Ce document explique comment installer et lancer le frontend React (Vite + Tailwind CSS).

## 1. Prérequis

- Node.js 18 ou supérieur
- npm (inclus avec Node.js)

Vérifier les versions :

```bash
node --version   # ≥ 18
npm --version
```

## 2. Installation

```bash
cd frontend
npm install
```

Les dépendances principales : React 19, React Router DOM 7, Axios, Tailwind CSS 3, Vite 8.

## 3. Lancer le serveur de développement

```bash
npm run dev
```

Vite démarre sur `http://localhost:5173` par défaut. Le rechargement à chaud (HMR) est actif : toute modification dans `src/` est répercutée instantanément dans le navigateur sans rechargement manuel.

## 4. Structure du projet

```
frontend/
├── index.html              ← point d'entrée HTML
├── vite.config.js          ← configuration Vite + plugin React
├── tailwind.config.js      ← configuration Tailwind (scan src/**/*.{js,jsx})
├── package.json
└── src/
    ├── main.jsx            ← point d'entrée React (montage dans #root)
    ├── App.jsx             ← routing principal (BrowserRouter)
    ├── index.css           ← directives Tailwind (@tailwind base/components/utilities)
    ├── components/         ← composants réutilisables
    │   ├── NavBar.jsx      ← barre de navigation avec liens actifs
    │   ├── PatientCard.jsx ← carte patient
    │   ├── Badge.jsx       ← badge de statut coloré (EN_ATTENTE, ANALYSEE, CLOTUREE)
    │   ├── DiagnosticIA.jsx← affichage résultat analyse IA
    │   └── LoadingSpinner.jsx
    ├── pages/              ← pages de l'application
    │   ├── LoginPage.jsx   ← formulaire de connexion
    │   ├── PatientsPage.jsx← liste + recherche patients
    │   ├── ConsultationsPage.jsx
    │   └── DashboardPage.jsx ← tableau de bord avec stats
    ├── services/           ← appels API (Axios)
    │   ├── apiUtils.js
    │   ├── authService.js
    │   ├── patientsService.js
    │   └── consultationsService.js
    └── contexts/           ← état global React
        └── AuthContext.jsx ← contexte d'authentification
```

## 5. Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement avec HMR |
| `npm run build` | Build de production dans `dist/` |
| `npm run preview` | Prévisualiser le build de production localement |
| `npm run lint` | Linter (oxlint) |

## 6. Connexion au backend

Le frontend communique avec l'API Spring Boot via Axios. Les services dans `src/services/` utilisent `apiUtils.js` pour la configuration de base (URL de l'API, en-têtes). L'authentification se fait par JWT : le token est stocké et injecté dans les requêtes via `AuthContext`.

L'URL de l'API backend est configurable dans les services. Par défaut, elle pointe vers `http://localhost:8080`.

## 7. Build de production

```bash
npm run build
```

Le dossier `dist/` contient les fichiers statiques prêts à être servis par un serveur web (Nginx, Apache) ou par le backend Spring Boot via `src/main/resources/static/`.
