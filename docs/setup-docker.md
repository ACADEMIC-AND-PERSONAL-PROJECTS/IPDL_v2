# Documentation Docker

Ce document explique comment utiliser le fichier `docker-compose.yml` du projet SénSanté Pro pour démarrer PostgreSQL et pgAdmin, puis comment connecter une application Spring Boot à cette base de données.

## 1. Services définis dans `docker-compose.yml`

Le fichier compose contient deux services:

- `postgres`: base de données PostgreSQL 15 basée sur l'image `postgres:15-alpine`
- `pgadmin`: interface web d'administration basée sur l'image `dpage/pgadmin4:latest`

Il déclare aussi un volume persistant nommé `postgres_data` afin de conserver les données de la base même si le conteneur est supprimé.

### Paramètres PostgreSQL

Le service `postgres` utilise les variables suivantes:

- `POSTGRES_DB=sensante_pro`
- `POSTGRES_USER=sensante_user`
- `POSTGRES_PASSWORD=sensante_pass`

La base sera accessible localement sur le port `5432`.

### Paramètres pgAdmin

Le service `pgadmin` expose l’interface web sur le port `5050`.

- Email de connexion: `admin@sensante.sn`
- Mot de passe: `admin`

## 2. Démarrer l’environnement Docker

Place-toi dans le dossier racine du projet, là où se trouve le fichier `docker-compose.yml`, puis lance:

```bash
docker compose up -d
```

Si ton installation utilise encore l’ancienne commande, tu peux aussi exécuter:

```bash
docker-compose up -d
```

### Vérifier que les conteneurs tournent

```bash
docker compose ps
```

### Voir les logs

```bash
docker compose logs -f
```

### Arrêter l’environnement

```bash
docker compose down
```

### Arrêter en supprimant aussi les données

La commande suivante supprime les conteneurs et le volume `postgres_data`:

```bash
docker compose down -v
```

## 3. Accéder à PostgreSQL et à pgAdmin

### PostgreSQL

Depuis l’application Spring Boot ou depuis un client SQL, la base est accessible sur:

- Hôte: `localhost`
- Port: `5432`
- Base de données: `sensante_pro`
- Utilisateur: `sensante_user`
- Mot de passe: `sensante_pass`

### pgAdmin

Ouvre ton navigateur à l’adresse suivante:

```text
http://localhost:5050
```

Connecte-toi avec:

- Email: `admin@sensante.sn`
- Mot de passe: `admin`

Pour ajouter le serveur PostgreSQL dans pgAdmin:

1. Clique sur `Add New Server`
2. Onglet `General`: donne un nom, par exemple `sensante-postgres`
3. Onglet `Connection`:
   - Host name/address: `postgres`
   - Port: `5432`
   - Maintenance database: `sensante_pro`
   - Username: `sensante_user`
   - Password: `sensante_pass`

Important: dans pgAdmin, le nom d’hôte à utiliser depuis un conteneur Docker est `postgres`, pas `localhost`.

## 4. Ce qu’il faut mettre dans `application.properties`

Ajoute ces propriétés dans `src/main/resources/application.properties` pour utiliser la base PostgreSQL définie dans ce `docker-compose.yml`:

```properties
spring.application.name=sensante-pro

spring.datasource.url=jdbc:postgresql://localhost:5432/sensante_pro
spring.datasource.username=sensante_user
spring.datasource.password=sensante_pass
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

Si ton application Spring Boot tourne elle aussi dans un conteneur Docker du même réseau que ce `docker-compose.yml`, remplace `localhost` par `postgres` dans `spring.datasource.url`.

## 5. Dépendance Maven ou Gradle nécessaire

Ton projet Spring Boot doit contenir le driver PostgreSQL.

### Exemple Maven

```xml
<dependency>
	<groupId>org.postgresql</groupId>
	<artifactId>postgresql</artifactId>
	<scope>runtime</scope>
</dependency>
```

### Exemple Gradle

```gradle
runtimeOnly 'org.postgresql:postgresql'
```

## 6. Vérification rapide

1. Lancer Docker avec `docker compose up -d`
2. Vérifier que PostgreSQL est démarré avec `docker compose ps`
3. Ajouter les propriétés Spring Boot dans `application.properties`
4. Démarrer l’application Spring Boot
5. Vérifier que l’application se connecte bien à la base