# Utilisateurs de test

Tous les utilisateurs partagent le même mot de passe : **`test123`**

| Rôle | Email | Établissement |
|---|---|---|
| AGENT | `agent.dakar@sensante.sn` | Hôpital Principal de Dakar |
| MEDECIN | `medecin.dakar@sensante.sn` | Hôpital Principal de Dakar |
| ADMIN | `admin.dakar@sensante.sn` | Hôpital Principal de Dakar |
| AGENT | `agent.thies@sensante.sn` | Centre de Santé de Thiès |
| MEDECIN | `medecin.thies@sensante.sn` | Centre de Santé de Thiès |
| ADMIN | `admin.thies@sensante.sn` | Centre de Santé de Thiès |
| AGENT | `agent.tamba@sensante.sn` | Poste de Santé de Tambacounda |
| MEDECIN | `medecin.tamba@sensante.sn` | Poste de Santé de Tambacounda |
| ADMIN | `admin.tamba@sensante.sn` | Poste de Santé de Tambacounda |

## Rôles et permissions

| Rôle | Endpoints accessibles |
|---|---|
| AGENT | `/api/patients` (tous) |
| MEDECIN | `/api/patients` (tous) |
| ADMIN | `/api/patients` (tous) |

Les trois rôles ont actuellement les mêmes permissions sur les endpoints patients (`hasAnyRole('AGENT', 'MEDECIN', 'ADMIN')`).

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

Utiliser le token dans l'en-tête `Authorization: Bearer <jwt>` pour les appels suivants.
