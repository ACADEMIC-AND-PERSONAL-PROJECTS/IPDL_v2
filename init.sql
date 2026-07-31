-- ================================================================
-- SénSanté Pro — Script d'initialisation du schéma de production
-- PostgreSQL 15+
-- ================================================================

BEGIN;

-- ================================================================
-- 1. TABLES
-- ================================================================

-- Établissements de santé
CREATE TABLE IF NOT EXISTS etablissements (
    id                  BIGSERIAL       PRIMARY KEY,
    nom                 VARCHAR(200)    NOT NULL,
    type_etablissement  VARCHAR(20)     NOT NULL CHECK (type_etablissement IN ('HOPITAL', 'CENTRE_SANTE', 'POST_SANTE')),
    region              VARCHAR(100)    NOT NULL,
    telephone           VARCHAR(20),
    adresse             VARCHAR(300)
);

-- Utilisateurs (agents, médecins, admins)
CREATE TABLE IF NOT EXISTS users (
    id                BIGSERIAL       PRIMARY KEY,
    nom               VARCHAR(100)    NOT NULL,
    prenom            VARCHAR(100)    NOT NULL,
    email             VARCHAR(200)    NOT NULL UNIQUE,
    password          VARCHAR(255)    NOT NULL,
    role              VARCHAR(20)     NOT NULL CHECK (role IN ('AGENT', 'MEDECIN', 'ADMIN')),
    etablissement_id  BIGINT          NOT NULL REFERENCES etablissements(id)
);

-- Patients
CREATE TABLE IF NOT EXISTS patients (
    id                BIGSERIAL       PRIMARY KEY,
    nom               VARCHAR(100)    NOT NULL,
    prenom            VARCHAR(100)    NOT NULL,
    date_naissance    DATE,
    sexe              VARCHAR(10)     CHECK (sexe IN ('MASCULIN', 'FEMININ')),
    telephone         VARCHAR(20),
    adresse           VARCHAR(300),
    region            VARCHAR(100),
    numero_dossier    VARCHAR(50)     NOT NULL UNIQUE,
    etablissement_id  BIGINT          NOT NULL REFERENCES etablissements(id)
);

-- Consultations
CREATE TABLE IF NOT EXISTS consultations (
    id                BIGSERIAL       PRIMARY KEY,
    date              TIMESTAMP       NOT NULL,
    symptomes         TEXT,
    diagnostic_ia     TEXT,
    score_confiance   DOUBLE PRECISION,
    statut            VARCHAR(20)     NOT NULL DEFAULT 'EN_ATTENTE'
                                      CHECK (statut IN ('EN_ATTENTE', 'ANALYSEE', 'CLOTUREE')),
    notes             TEXT,
    patient_id        BIGINT          NOT NULL REFERENCES patients(id),
    user_id           BIGINT          NOT NULL REFERENCES users(id)
);

-- ================================================================
-- 2. INDEX
-- ================================================================

-- Accélérer les jointures et les filtres fréquents
CREATE INDEX IF NOT EXISTS idx_users_etablissement    ON users(etablissement_id);
CREATE INDEX IF NOT EXISTS idx_users_email            ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role             ON users(role);

CREATE INDEX IF NOT EXISTS idx_patients_etablissement ON patients(etablissement_id);
CREATE INDEX IF NOT EXISTS idx_patients_dossier       ON patients(numero_dossier);
CREATE INDEX IF NOT EXISTS idx_patients_region        ON patients(region);

CREATE INDEX IF NOT EXISTS idx_consultations_patient  ON consultations(patient_id);
CREATE INDEX IF NOT EXISTS idx_consultations_user     ON consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_consultations_date     ON consultations(date DESC);
CREATE INDEX IF NOT EXISTS idx_consultations_statut   ON consultations(statut);

-- ================================================================
-- 3. VUE — dashboard analytics (optionnelle, évite des queries lourdes)
-- ================================================================

CREATE OR REPLACE VIEW v_consultations_resume AS
SELECT
    c.id,
    c.date,
    c.statut,
    c.score_confiance,
    p.id          AS patient_id,
    p.region      AS patient_region,
    u.id          AS praticien_id,
    u.role        AS praticien_role,
    e.id          AS etablissement_id,
    e.nom         AS etablissement_nom,
    e.type_etablissement
FROM consultations c
JOIN patients p        ON c.patient_id = p.id
JOIN users u           ON c.user_id = u.id
JOIN etablissements e  ON p.etablissement_id = e.id;

COMMIT;
