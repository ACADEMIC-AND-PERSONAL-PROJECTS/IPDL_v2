# Consultation Notes - SenSante Pro

Ce document decrit le modele de donnees pour les entites `Consultation` et `AuditLog`.

## 1. Entite Consultation

La consultation represente un acte medical lie a un patient et a un professionnel de sante.

### Champs principaux

| Champ | Description |
|---|---|
| `id` | Identifiant unique de la consultation |
| `date` | Date de la consultation |
| `symptomes` | Symptomes saisis (format texte long ou JSON) |
| `diagnostic_ia` | Proposition d'aide au diagnostic generee par le module IA |
| `score_confiance` | Niveau de confiance associe au resultat IA |
| `statut` | Etat de la consultation (ex: ouverte, terminee) |
| `notes` | Notes cliniques complementaires |
| `patient_id` | Reference vers le patient concerne |
| `user_id` | Reference vers l'utilisateur (agent ou medecin) qui a saisi la consultation |

### Relations

- Une `Consultation` appartient a un `Patient` (`patient_id`).
- Une `Consultation` est creee par un `User` (`user_id`).

## 2. Entite AuditLog

Le journal d'audit trace les actions sensibles effectuees dans l'application.

### Champs principaux

| Champ | Description |
|---|---|
| `id` | Identifiant unique de la ligne d'audit |
| `action` | Action effectuee (creation, modification, suppression, connexion, etc.) |
| `user_id` | Utilisateur a l'origine de l'action |
| `entite` | Nom de l'entite ciblee (ex: Consultation, Patient, User) |
| `entite_id` | Identifiant de l'entite ciblee |
| `timestamp` | Date et heure de l'action |

### Objectif

`AuditLog` permet de:
- tracer les operations critiques;
- renforcer la conformite et la securite;
- faciliter l'analyse d'incidents et les controles administrateur.
