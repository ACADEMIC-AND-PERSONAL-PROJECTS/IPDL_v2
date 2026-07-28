# Gestion des secrets — SénSanté Pro

Ce document décrit la procédure de gestion des secrets pour le projet : où ils se trouvent, comment les injecter, comment les protéger, et comment les faire tourner.

## 1. Inventaire des secrets

Le projet manipule quatre catégories de secrets.

| Secret | Emplacement actuel | Type |
|---|---|---|
| `spring.datasource.password` | `application.properties` (hardcodé) | Base de données PostgreSQL |
| `jwt.secret` | `application.properties` (hardcodé) | Signature des tokens JWT (HS256) |
| `spring.ai.openai.api-key` | `application.properties` → `${ANTHROPIC_AUTH_TOKEN}` | Clé API DeepSeek (fournisseur OpenAI-compatible) |
| `POSTGRES_PASSWORD`, `PGADMIN_DEFAULT_PASSWORD` | `docker-compose.yml` (hardcodés) | Conteneurs Docker locaux |

Les secrets sont consommés par :

- `JwtService.java:17` — `@Value("${jwt.secret}")` pour signer et vérifier les tokens JWT
- `application.properties:12` — `spring.datasource.password` pour la connexion JDBC à PostgreSQL
- `application.properties:35` — `spring.ai.openai.api-key` pour l'appel à l'API DeepSeek via Spring AI
- `docker-compose.yml:9` — `POSTGRES_PASSWORD` au démarrage du conteneur PostgreSQL

## 2. Ce qui est déjà protégé

Le fichier `.gitignore` (lignes 58-77) exclut déjà du versionnement :

- `.env`, `.env.local`, `.env.*.local`
- `*.pem`, `*.key`, `*.cert`
- Le dossier `secrets/`
- Les profils Spring Boot locaux : `application-local.properties`, `application-dev.properties`, `application-prod.properties`
- `src/main/resources/application.properties` (ligne 135)

**Le fichier `application.properties` actuellement présent dans le repo a été commité avant l'ajout de cette règle et contient des secrets.** La rotation de ces secrets est nécessaire (section 5).

## 3. Procédure pour le développement local

### 3.1 Fichier `.env`

Créer un fichier `.env` à la racine du projet (jamais commité) :

```bash
# Base de données
DB_URL=jdbc:postgresql://localhost:5432/demo_pro
DB_USERNAME=demo_user
DB_PASSWORD=<valeur-generée>

# JWT — générer une clé d'au moins 256 bits
JWT_SECRET=<clé-générée>
JWT_EXPIRATION=86400000

# DeepSeek (fournisseur OpenAI-compatible)
ANTHROPIC_AUTH_TOKEN=<token-api>
```

### 3.2 Générer le secret JWT

Le secret JWT doit mesurer au moins 256 bits (32 octets) pour HS256. Le générer avec :

```bash
openssl rand -base64 64
```

### 3.3 Fichier `application.properties` template

Créer `src/main/resources/application.properties.example` (peut être commité) comme modèle :

```properties
spring.application.name=demo
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect

logging.level.org.springframework=INFO
logging.level.com.example.demo=DEBUG

jwt.secret=${JWT_SECRET}
jwt.expiration=${JWT_EXPIRATION}

springdoc.api-docs.path=/v3/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.swagger-ui.operations-sorter=method

spring.ai.openai.api-key=${ANTHROPIC_AUTH_TOKEN}
spring.ai.openai.base-url=https://api.deepseek.com
spring.ai.openai.chat.model=deepseek-v4-flash
spring.ai.openai.chat.max-tokens=500
spring.ai.openai.chat.temperature=0.3
```

Spring Boot résout automatiquement les variables d'environnement et les placeholders `${...}` à partir d'un fichier `.env` si le projet utilise `spring-boot-dotenv` ou une configuration shell qui exporte ces variables. Sans dépendance supplémentaire, les variables doivent être exportées dans le shell avant le lancement :

```bash
set -a && source .env && set +a
./mvnw spring-boot:run
```

Ou, avec IntelliJ, utiliser le plugin EnvFile pour charger le `.env` automatiquement.

### 3.4 Docker Compose avec `.env`

Modifier `docker-compose.yml` pour référencer les variables au lieu de les hardcoder :

```yaml
services:
  postgres:
    image: postgres:15-alpine
    container_name: demo_app
    environment:
      POSTGRES_DB: demo_pro
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USERNAME} -d demo_pro"]
      interval: 10s
      timeout: 30s
      retries: 5
```

Docker Compose lit automatiquement le fichier `.env` présent dans le même répertoire.

### 3.5 Vérification avant commit

Avant chaque commit, exécuter :

```bash
grep -rE "(password|secret|key|token)\s*=" src/main/resources/application.properties 2>/dev/null && echo "ATTENTION: secrets potentiels dans application.properties" || echo "OK"
```

## 4. Procédure pour la production

### 4.1 Injection par variables d'environnement

En production, ne jamais utiliser de fichier `.env` sur le serveur. Injecter les secrets via l'orchestrateur :

- **Docker Swarm / Kubernetes** : secrets montés comme variables d'environnement ou fichiers
- **Systemd** : `Environment=` ou `EnvironmentFile=` avec permissions `0600`
- **Plateforme cloud** : secrets manager du fournisseur (AWS Secrets Manager, GCP Secret Manager, Azure Key Vault)

### 4.2 Secret JWT en production

Le secret JWT doit être différent de celui de développement, généré de la même manière :

```bash
openssl rand -base64 64
```

La valeur de `jwt.expiration` doit être courte (par exemple 3600000 ms = 1 heure) et les tokens doivent être rafraîchis via un mécanisme de refresh token.

### 4.3 Rotation des secrets

La rotation suit cette séquence :

1. Générer la nouvelle valeur du secret
2. Pour la base de données : créer le nouvel utilisateur/mot de passe, mettre à jour les droits, puis supprimer l'ancien
3. Pour JWT : déployer la nouvelle valeur — les tokens signés avec l'ancien secret deviendront invalides, les utilisateurs devront se ré-authentifier
4. Pour l'API AI : régénérer le token chez le fournisseur, mettre à jour la variable d'environnement, redémarrer l'application
5. Supprimer toute trace de l'ancien secret (fichiers, variables d'environnement obsolètes, historique shell)

## 5. Actions immédiates requises

Étant donné que `application.properties` a été commité avec des secrets avant l'ajout de la règle `.gitignore` :

1. **Faire tourner le secret JWT** sur tous les environnements — le commit `src/main/resources/application.properties` contient une clé JWT visible dans l'historique git
2. **Faire tourner les mots de passe PostgreSQL** de développement
3. **Vérifier que `ANTHROPIC_AUTH_TOKEN` n'a pas été commité** en clair
4. **Purger l'historique git** avec `git filter-branch` ou `BFG Repo-Cleaner` si les secrets doivent disparaître complètement de l'historique :

```bash
# Option A : Réécrire l'historique pour supprimer le fichier
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch src/main/resources/application.properties" \
  --prune-empty --tag-name-filter cat -- --all

# Option B : Utiliser BFG Repo-Cleaner (plus rapide)
bfg --delete-files application.properties .
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

## 6. Références

- `.gitignore` : règles lignes 58-77 (environnement et secrets) et ligne 135 (application.properties)
- `application.properties` : `src/main/resources/application.properties`
- `JwtService.java` : `src/main/java/com/example/demo/auth/service/JwtService.java`
- `AiConfig.java` : `src/main/java/com/example/demo/config/AiConfig.java`
- `docker-compose.yml` : racine du projet
