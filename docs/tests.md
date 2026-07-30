# Tests — SénSanté Pro

Ce document explique comment lancer les tests du backend et du frontend en local.

---

## Prérequis

- **Java 21** (distribution Temurin recommandée)
- **Maven** (le wrapper `mvnw` est fourni, pas besoin d'installer Maven)
- **Node.js 22** et **npm** (pour les tests frontend)
- **Docker** (optionnel — pour PostgreSQL en local)

---

## Backend (Spring Boot)

### Lancer tous les tests

```bash
./mvnw test
```

Ou avec Maven installé :

```bash
mvn test
```

La sortie affiche un résumé :

```
Tests run: 9, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

### Lancer un test spécifique

```bash
mvn test -Dtest=AuthControllerTest
```

### Lancer une classe de test spécifique avec un nom complet

```bash
mvn test -Dtest=com.example.demo.AuthControllerTest
```

### Lancer un seul cas de test

```bash
mvn test -Dtest=AuthControllerTest#loginReussi
```

### Lancer les tests avec stacktrace complète en cas d'erreur

```bash
mvn test -Dtest=AuthControllerTest -e
```

### Lancer les tests sans télécharger les dépendances (mode silencieux)

```bash
mvn test --no-transfer-progress
```

### Tests disponibles

| Classe | Type | Description |
|---|---|---|
| `DemoApplicationTests` | `@SpringBootTest` | Vérifie que le contexte Spring se charge complètement (base H2, beans AI mockés) |
| `AuthControllerTest` | `@WebMvcTest` | 8 tests sur `POST /api/auth/login` : cas nominaux, erreurs métier, validation, sécurité |

### Configuration de test

Les tests utilisent une configuration dédiée dans `src/test/resources/application.properties` :

- **Base de données** : H2 en mémoire (`jdbc:h2:mem:testdb`), aucune installation requise
- **JWT** : secret identique à la configuration de développement
- **Spring AI** : token factice (`test-dummy-token-for-ci`) et bean `ChatClient` mocké via `@MockitoBean`
- **Bean overriding** : `spring.main.allow-bean-definition-overriding=true` pour permettre aux mocks de remplacer les beans réels

Aucune variable d'environnement n'est nécessaire pour lancer les tests en local. Le `DataInitializer` est exécuté dans le contexte de `@SpringBootTest` (45 consultations réparties sur 3 mois sont insérées).

---

## Frontend (React + Vite)

Le projet frontend n'a pas encore de tests unitaires (Vitest ou Jest). La vérification se limite au build :

```bash
cd frontend && npm run build
```

Un build réussi confirme que tous les modules sont importés correctement et que le code est syntaxiquement valide.

---

## CI/CD (GitHub Actions)

Le pipeline `Pipeline SenSante Pro` (`.github/workflows/github-ci.yml`) exécute les tests à chaque push sur `develop` et `main` et à chaque pull request.

**Job `test-backend` :**

- PostgreSQL 15 est démarré comme service container
- Java 21 est installé via `setup-java@v4` avec cache Maven
- La variable `ANTHROPIC_AUTH_TOKEN` est injectée depuis les secrets GitHub
- `mvn test --no-transfer-progress` est exécuté
- Les rapports Surefire sont publiés via `dorny/test-reporter@v1`

**Job `build-frontend` :**

- Node.js 22 est installé
- `npm ci` puis `npm run build`

---

## Écrire de nouveaux tests

### Test d'intégration (@SpringBootTest)

Pour tester le contexte complet (contrôleur → service → repository → base H2) :

```java
@SpringBootTest
@AutoConfigureMockMvc
class MonTestIntegration {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean   // mocker les beans qui appellent des APIs externes
    private ChatClient chatClient;

    @Test
    void monTest() throws Exception {
        mockMvc.perform(get("/api/patients"))
            .andExpect(status().isOk());
    }
}
```

### Test de couche web (@WebMvcTest)

Pour tester un contrôleur isolément (service et repository mockés) :

```java
@WebMvcTest(MonController.class)
class MonTestWeb {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private MonService monService;

    @Test
    void monTest() throws Exception { ... }
}
```

> **Note Spring Boot 4.1.0** : `@WebMvcTest` est dans le package `org.springframework.boot.webmvc.test.autoconfigure` (et non plus `org.springframework.boot.test.autoconfigure.web.servlet`). `@MockitoBean` remplace `@MockBean` (déprécié puis supprimé).

### Dépendances nécessaires

```xml
<!-- Test Spring Boot (MockMvc, @SpringBootTest, @MockitoBean) -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>

<!-- Test couche web (@WebMvcTest) -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webmvc-test</artifactId>
    <scope>test</scope>
</dependency>

<!-- Base H2 pour les tests (pas de PostgreSQL requis en local) -->
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>test</scope>
</dependency>
```

---

## Dépannage

**`Could not resolve placeholder 'jwt.secret'`**  
→ Le fichier `src/test/resources/application.properties` est manquant ou incomplet. Il doit contenir `jwt.secret` et `jwt.expiration`.

**`Failed to configure a DataSource: 'url' attribute is not specified`**  
→ H2 n'est pas dans le classpath ou `spring.datasource.url` n'est pas défini dans les propriétés de test.

**`No qualifying bean of type 'com.fasterxml.jackson.databind.ObjectMapper'`**  
→ Ne pas `@Autowired` ObjectMapper dans un `@WebMvcTest`. Utiliser directement les chaînes JSON pour `content()`.

**`BeanDefinitionOverrideException`**  
→ Ajouter `spring.main.allow-bean-definition-overriding=true` dans `src/test/resources/application.properties`.
