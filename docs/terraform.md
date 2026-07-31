# Infrastructure as Code — Terraform

SénSanté Pro utilise Terraform pour provisionner l'infrastructure Docker
complète (PostgreSQL + backend Spring Boot + frontend React/Nginx) de manière
déclarative et reproductible.

## Installation

Terraform est un binaire unique. Télécharger la version ≥ 1.6 depuis
<https://developer.hashicorp.com/terraform/downloads>, puis placer le binaire
dans le `PATH`.

```bash
# Linux / macOS
wget https://releases.hashicorp.com/terraform/1.6.0/terraform_1.6.0_linux_amd64.zip
unzip terraform_1.6.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/

# Vérification
terraform --version   # doit afficher ≥ 1.6
```

Aucun autre outil n'est requis : Terraform communique directement avec le
daemon Docker du VPS via SSH (n'ouvre pas le port Docker TCP).

## Architecture

Les conteneurs sont déployés sur un réseau Docker bridge `sensante-tf-network`
et communiquent via leurs noms DNS (`postgres`, `backend`, `frontend`). Les
noms sont volontairement alignés avec ceux de `docker-compose.prod.yml` pour
que les fichiers de configuration existants (nginx.conf, application.properties)
fonctionnent sans modification.

```
[frontend :80]  —proxy_pass→  [backend :8080]  —JDBC→  [postgres :5432]
     ↑                              ↑                      ↑
  port host 8088               port host 8081        port host 5433
```

- **postgres** : image officielle `postgres:15-alpine`, volume persistant
- **backend** : build depuis `Dockerfile` racine, rebuild auto si `src/` change
- **frontend** : build depuis `frontend/Dockerfile`, rebuild auto si `frontend/src/` change

## Structure du projet

```
terraform/
├── main.tf        # Ressources : réseau, volumes, conteneurs, images
├── variables.tf   # Déclaration des variables d'entrée
├── outputs.tf     # Valeurs exposées après le déploiement
└── terraform.tfvars  # Valeurs des variables (non versionné, sensible)
```

## Variables

| Variable                | Type   | Obligatoire | Valeur par défaut  | Description                    |
|-------------------------|--------|-------------|---------------------|--------------------------------|
| `postgres_db`           | string | Non         | `sensante_pro`      | Nom de la base de données      |
| `postgres_user`         | string | Non         | `sensante_user`     | Utilisateur PostgreSQL         |
| `postgres_password`     | string | **Oui**     | —                   | Mot de passe PostgreSQL        |
| `postgres_port`         | number | Non         | `5433`              | Port PostgreSQL exposé host    |
| `backend_port`          | number | Non         | `8081`              | Port backend exposé host       |
| `frontend_port`         | number | Non         | `8088`              | Port frontend exposé host      |
| `jwt_secret`            | string | **Oui**     | —                   | Clé de signature JWT           |
| `anthropic_auth_token`  | string | **Oui**     | —                   | Clé API DeepSeek               |

Les variables sensibles n'ont pas de valeur par défaut. Elles doivent être
fournies au moment du `plan` / `apply` (voir plus bas).

## Fichier terraform.tfvars

Créer `terraform/terraform.tfvars` avec les valeurs sensibles — ce fichier est
ignoré par Git (`.gitignore`) et ne doit jamais être commité :

```hcl
postgres_password  = "votre_mot_de_passe_postgres"
jwt_secret         = "votre_cle_jwt_minimum_256_bits"
anthropic_auth_token = "sk-votre-cle-deepseek"
```

## Commandes

Toutes les commandes s'exécutent depuis le dossier `terraform/`.

### Initialiser le projet

```bash
cd terraform
terraform init
```

Cette commande télécharge le provider `kreuzwerker/docker` et prépare le
répertoire de travail. Elle ne modifie rien sur le VPS. À relancer après un
changement de provider ou de version.

Par défaut, Terraform communique avec le daemon Docker local (`/var/run/docker.sock`).
Pour piloter un Docker distant via SSH, surcharger le provider dans `main.tf` :

```hcl
provider "docker" {
  host = "ssh://khadim@165.232.81.136"
}
```

Et charger la clé SSH dans l'agent avant `terraform plan` / `apply`.

### Simuler les changements

```bash
terraform plan
```

Affiche un résumé de ce que Terraform va créer, modifier ou détruire. Aucune
modification réelle n'est appliquée. Les symboles :

- `+` ressource à créer
- `~` ressource qui sera modifiée sur place
- `-` ressource qui sera détruite
- `-/+` ressource qui sera détruite puis recréée

Toujours lire le plan avant un `apply`. En CI/CD, le plan est uploadé comme
artefact pour inspection.

### Appliquer les changements

```bash
terraform apply
```

Applique le plan. Terraform redemande une confirmation interactive. Pour un
usage automatisé (CI/CD), utiliser le plan sauvegardé :

```bash
terraform plan -out=tfplan      # sauvegarde le plan
terraform apply tfplan          # applique ce plan exact, sans confirmation
```

### Détruire l'infrastructure

```bash
terraform destroy
```

Arrête et supprime tous les conteneurs, volumes et réseaux créés par Terraform.
À utiliser avec précaution : les données PostgreSQL sont perdues.

### Voir l'état courant

```bash
terraform show    # affiche l'état complet
terraform output  # affiche uniquement les outputs
```

## Outputs

Après un `terraform apply`, les valeurs suivantes sont disponibles :

```bash
$ terraform output
postgres_container_id = "abc123def456..."
backend_url           = "http://localhost:8081"
frontend_url          = "http://localhost:8088"
infrastructure_info   = {
  reseau   = "sensante-tf-network"
  postgres = "postgres"
  backend  = "backend"
  frontend = "frontend"
}
```

| Output                     | Description                          |
|----------------------------|--------------------------------------|
| `postgres_container_id`    | ID Docker du conteneur PostgreSQL    |
| `backend_url`              | URL locale du backend Spring Boot    |
| `frontend_url`             | URL locale du frontend React         |
| `infrastructure_info`      | Noms du réseau et des 3 conteneurs   |

## Workflow typique

```bash
cd terraform

# 1. Initialiser
terraform init

# 2. Simuler
terraform plan

# 3. Vérifier que le plan correspond à ce qui est attendu, puis appliquer
terraform apply

# 4. Vérifier que tout répond
curl http://localhost:8081/actuator/health   # backend
curl http://localhost:8088                   # frontend
```

## CI/CD

Dans GitHub Actions, le pipeline est découpé en deux jobs distincts :

1. **terraform-plan** (automatique sur push main) — `terraform plan -out=tfplan`,
   le plan est uploadé comme artefact.

2. **terraform-apply** (déclenchement manuel, environment `production`) —
   télécharge le plan et exécute `terraform apply -auto-approve tfplan`.

Les variables sensibles transitent via les secrets GitHub avec le préfixe
`TF_VAR_` que Terraform détecte automatiquement. Aucune variable sensible
n'apparaît dans les logs.

## Dépannage

**`terraform init` échoue avec "Failed to query available provider packages"**
→ Vérifier la connexion internet. Le provider est téléchargé depuis le
registre public HashiCorp.

**`Error: Unable to connect to Docker daemon`**
→ La clé SSH n'est pas chargée dans l'agent. Vérifier que `ssh-agent` est
actif et que la clé `~/.ssh/digital_ocean` a les bonnes permissions (`600`).

**`Error: resource already exists`**
→ Un conteneur ou volume portant le même nom existe déjà mais n'est pas géré
par Terraform. Le supprimer manuellement ou l'importer avec
`terraform import`.
