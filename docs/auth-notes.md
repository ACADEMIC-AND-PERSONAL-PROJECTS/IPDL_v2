# Auth Notes - SenSante Pro

Ce document liste les endpoints d'authentification prevus dans le projet.

## Endpoints

### 1. Inscription

- **Method**: `POST`
- **Path**: `/api/auth/register`
- **But**: creer un utilisateur de la plateforme (agent, medecin ou administrateur selon la politique d'acces).

Exemple de body JSON:

```json
{
  "nom": "Diop",
  "prenom": "Awa",
  "email": "awa.diop@demo.sn",
  "password": "MotDePasseFort123!",
  "role": "AGENT"
}
```

### 2. Connexion

- **Method**: `POST`
- **Path**: `/api/auth/login`
- **But**: authentifier un utilisateur et retourner un token JWT pour acceder aux endpoints proteges.

Exemple de body JSON:

```json
{
  "email": "awa.diop@demo.sn",
  "password": "MotDePasseFort123!"
}
```

Exemple de reponse attendue:

```json
{
  "accessToken": "<jwt-token>",
  "tokenType": "Bearer"
}
```
