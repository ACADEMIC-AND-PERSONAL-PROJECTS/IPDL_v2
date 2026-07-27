# Données de test — SenSante Pro

Toutes les données ci-dessous sont insérées automatiquement au démarrage par `DataInitializer` si la base est vide.

## Mot de passe

**Tous les comptes partagent le même mot de passe : `test123`**

---

## Établissements

| ID | Nom | Type | Région | Téléphone |
|---|---|---|---|---|
| 1 | Hôpital Principal de Dakar | HOPITAL | Dakar | 338394040 |
| 2 | Centre de Santé de Thiès | CENTRE_SANTE | Thiès | 339511234 |
| 3 | Poste de Santé de Tambacounda | POST_SANTE | Tambacounda | 339813456 |

---

## Utilisateurs

| Nom | Prénom | Email | Rôle | Établissement |
|---|---|---|---|---|
| Agent | Dakar | `agent.dakar@sensante.sn` | AGENT | Hôpital Principal de Dakar |
| Medecin | Dakar | `medecin.dakar@sensante.sn` | MEDECIN | Hôpital Principal de Dakar |
| Admin | Dakar | `admin.dakar@sensante.sn` | ADMIN | Hôpital Principal de Dakar |
| Agent | Thiès | `agent.thies@sensante.sn` | AGENT | Centre de Santé de Thiès |
| Medecin | Thiès | `medecin.thies@sensante.sn` | MEDECIN | Centre de Santé de Thiès |
| Admin | Thiès | `admin.thies@sensante.sn` | ADMIN | Centre de Santé de Thiès |
| Agent | Tambacounda | `agent.tamba@sensante.sn` | AGENT | Poste de Santé de Tambacounda |
| Medecin | Tambacounda | `medecin.tamba@sensante.sn` | MEDECIN | Poste de Santé de Tambacounda |
| Admin | Tambacounda | `admin.tamba@sensante.sn` | ADMIN | Poste de Santé de Tambacounda |

### Rôles

| Rôle | Responsabilité |
|---|---|
| AGENT | Saisit les consultations (symptômes, constantes), interroge l'IA |
| MEDECIN | Valide les diagnostics IA, clôture les consultations, rédige les notes finales |
| ADMIN | Gère les établissements, utilisateurs et patients |

---

## Patients

| ID | Nom | Prénom | Date naiss. | Sexe | Téléphone | Région | Établissement |
|---|---|---|---|---|---|---|---|
| 1 | Diop | Mamadou | 12/04/1985 | M | 770000001 | Dakar | Hôpital Principal de Dakar |
| 2 | Sow | Aminata | 25/08/1992 | F | 770000002 | Dakar | Hôpital Principal de Dakar |
| 3 | Diop | Mamadou | 12/04/1985 | M | 770000001 | Thiès | Centre de Santé de Thiès |
| 4 | Sow | Aminata | 25/08/1992 | F | 770000002 | Thiès | Centre de Santé de Thiès |
| 5 | Diop | Mamadou | 12/04/1985 | M | 770000001 | Tambacounda | Poste de Santé de Tambacounda |
| 6 | Sow | Aminata | 25/08/1992 | F | 770000002 | Tambacounda | Poste de Santé de Tambacounda |

Chaque patient reçoit un `numeroDossier` unique généré automatiquement au format `SP-XXXXXXXX`.

---

## Consultations

12 consultations sont créées (4 par établissement).

### Hôpital Principal de Dakar (patients 1–2, utilisateurs dakar)

| Patient | Agent | Statut | Diagnostic IA | Score | Résumé |
|---|---|---|---|---|---|
| Mamadou Diop | Medecin Dakar | CLOTUREE | Paludisme simple — P. falciparum | 94 % | TDR positif, traitement ACT prescrit, contrôle dans 1 semaine |
| Aminata Sow | Medecin Dakar | ANALYSEE | Infection urinaire basse — Cystite aiguë | 87 % | Brûlures mictionnelles, pollakiurie |
| Mamadou Diop | Agent Dakar | EN_ATTENTE | — | — | Toux productive, râles bronchiques, à orienter vers radio |
| Aminata Sow | Medecin Dakar | CLOTUREE | Hypertension artérielle essentielle stade 1 | 91 % | TA 148/92, conseils hygiéno-diététiques, contrôle 3 mois |

### Centre de Santé de Thiès (patients 3–4, utilisateurs thies)

| Patient | Agent | Statut | Diagnostic IA | Score | Résumé |
|---|---|---|---|---|---|
| Mamadou Diop | Medecin Thiès | CLOTUREE | Paludisme simple — P. falciparum | 94 % | TDR positif, traitement ACT prescrit, contrôle dans 1 semaine |
| Aminata Sow | Medecin Thiès | ANALYSEE | Infection urinaire basse — Cystite aiguë | 87 % | Brûlures mictionnelles, pollakiurie |
| Mamadou Diop | Agent Thiès | EN_ATTENTE | — | — | Toux productive, râles bronchiques, à orienter vers radio |
| Aminata Sow | Medecin Thiès | CLOTUREE | Hypertension artérielle essentielle stade 1 | 91 % | TA 148/92, conseils hygiéno-diététiques, contrôle 3 mois |

### Poste de Santé de Tambacounda (patients 5–6, utilisateurs tamba)

| Patient | Agent | Statut | Diagnostic IA | Score | Résumé |
|---|---|---|---|---|---|
| Mamadou Diop | Medecin Tamba | CLOTUREE | Paludisme simple — P. falciparum | 94 % | TDR positif, traitement ACT prescrit, contrôle dans 1 semaine |
| Aminata Sow | Medecin Tamba | ANALYSEE | Infection urinaire basse — Cystite aiguë | 87 % | Brûlures mictionnelles, pollakiurie |
| Mamadou Diop | Agent Tamba | EN_ATTENTE | — | — | Toux productive, râles bronchiques, à orienter vers radio |
| Aminata Sow | Medecin Tamba | CLOTUREE | Hypertension artérielle essentielle stade 1 | 91 % | TA 148/92, conseils hygiéno-diététiques, contrôle 3 mois |

### Statuts des consultations

| Statut | Signification |
|---|---|
| EN_ATTENTE | Consultation saisie par l'agent, en attente d'analyse IA ou de validation médecin |
| ANALYSEE | Diagnostic IA produit, en attente de validation ou d'action du médecin |
| CLOTUREE | Consultation finalisée par le médecin avec notes et traitement |

---

## Authentification

```
POST /api/auth/login
Content-Type: application/json

{
    "email": "agent.dakar@sensante.sn",
    "password": "test123"
}
```

Réponse :

```json
{
    "token": "<jwt>",
    "email": "agent.dakar@sensante.sn",
    "role": "AGENT",
    "message": "Connexion reussie"
}
```

Utiliser le token dans l'en-tête `Authorization: Bearer <jwt>` pour tous les appels suivants.

---

## Endpoints principaux

| Méthode | URL | Rôle |
|---|---|---|
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/register` | Public |
| GET | `/api/patients` | AGENT, MEDECIN, ADMIN |
| POST | `/api/patients` | AGENT, MEDECIN, ADMIN |
| GET | `/api/patients/{id}` | AGENT, MEDECIN, ADMIN |
| GET | `/api/consultations` | AGENT, MEDECIN, ADMIN |
| POST | `/api/consultations` | AGENT, MEDECIN |
| GET | `/api/consultations/{id}` | AGENT, MEDECIN, ADMIN |
| GET | `/api/consultations/patient/{patientId}` | AGENT, MEDECIN, ADMIN |
| GET | `/api/consultations/mes-consultations` | AGENT, MEDECIN |
| GET | `/api/consultations/statut/{statut}` | AGENT, MEDECIN, ADMIN |
| PATCH | `/api/consultations/{id}/cloturer` | MEDECIN |
| DELETE | `/api/consultations/{id}` | ADMIN |
