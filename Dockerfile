# === Stage 1 : Build ===
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app

# Copie du pom.xml sur le conteneur et telechargement des dependances
COPY pom.xml .
RUN mvn dependency:go-offline -q

# Copie du code source
COPY src ./src
RUN mvn clean package -DskipTests -q

# === Stage 2 : Image finale ===
FROM eclipse-temurin:21-jre-alpine AS runtime
WORKDIR /app

# Creation d'un utilisateur
RUN addgroup -S sensante && adduser -S sensante -G sensante
USER sensante

# Copie du jar
COPY --from=builder /app/target/demo-*.jar app.jar

# Expose le port 8080 du conteneur
EXPOSE 8080

# Commande principale que le conteneur lance
ENTRYPOINT [ "java", "-Djava.security.edge=file:/dev/./urandom", "-jar", "app.jar" ]