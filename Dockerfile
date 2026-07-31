FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app

# --- Layer 1 : Dependancies ---
COPY pom.xml .
RUN mvn dependency:go-offline -q

# --- Layer 2 : source code ---
COPY src ./src
RUN mvn clean package -DskipTests -q

# --- Final docker image ---
FROM eclipse-temurin:21-jre-alpine AS runtime
RUN addgroup -S sensante && adduser -S sensante -G sensante

WORKDIR /app
COPY --from=builder /app/target/demo-*.jar app.jar
RUN chown sensante:sensante app.jar

USER sensante
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

ENTRYPOINT [ "java", "-Djava.security.edg=file:/dev/./urandom", "-Xmx512m", "-jar", "app.jar" ]