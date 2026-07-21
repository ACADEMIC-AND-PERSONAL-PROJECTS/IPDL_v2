# Frontend Notes - SenSante Pro

Ce document liste les pages React prevues pour la SPA du projet.

## Pages prevues

## 1. Login

- **Route suggeree**: `/login`
- **Objectif**: authentifier l'utilisateur via `/api/auth/login`.
- **Elements principaux**:
  - formulaire email/mot de passe;
  - gestion du token JWT;
  - redirection apres connexion reussie.

## 2. Patients

- **Route suggeree**: `/patients`
- **Objectif**: consulter et gerer les patients.
- **Elements principaux**:
  - liste des patients;
  - creation d'un patient;
  - edition et suppression selon les droits.

## 3. Consultations

- **Route suggeree**: `/consultations`
- **Objectif**: creer et suivre les consultations medicales.
- **Elements principaux**:
  - formulaire de consultation (symptomes, notes, patient);
  - affichage des consultations existantes;
  - affichage du resultat IA et de son score de confiance.

## 4. Dashboard

- **Route suggeree**: `/dashboard`
- **Objectif**: visualiser les statistiques de l'etablissement.
- **Elements principaux**:
  - indicateurs cles (volume de consultations, activite);
  - graphiques d'analyse;
  - filtres par periode et/ou categorie selon les besoins.
