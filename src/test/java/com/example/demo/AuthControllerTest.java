package com.example.demo;

import com.example.demo.auth.controller.AuthController;
import com.example.demo.auth.dto.AuthResponse;
import com.example.demo.auth.service.AuthService;
import com.example.demo.auth.service.JwtService;
import com.example.demo.patient.service.EtablissementService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@DisplayName("AuthController - POST /api/auth/login")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private EtablissementService etablissementService;

    @Nested
    @DisplayName("Cas nominaux")
    class CasNominaux {

        @Test
        @DisplayName("Retourne 200 + token JWT quand les credentials sont valides")
        void loginReussi() throws Exception {
            var response = new AuthResponse(
                    "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtZWRlY2luQGRha2FyLnNuIiwicm9sZSI6Ik1FREVDSU4ifQ.signature",
                    "medecin.dakar@sensante.sn",
                    "MEDECIN",
                    "Connexion reussie"
            );

            when(authService.login(any())).thenReturn(response);

            var body = """
                    {
                        "email": "medecin.dakar@sensante.sn",
                        "password": "test123"
                    }""";

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(body))
                    .andExpect(status().isOk())
                    .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                    .andExpect(jsonPath("$.token").isNotEmpty())
                    .andExpect(jsonPath("$.email").value("medecin.dakar@sensante.sn"))
                    .andExpect(jsonPath("$.role").value("MEDECIN"))
                    .andExpect(jsonPath("$.message").value("Connexion reussie"));

            verify(authService).login(any());
        }
    }

    @Nested
    @DisplayName("Cas d'erreur metier")
    class CasErreurMetier {

        @Test
        @DisplayName("Retourne 404 quand l'email n'existe pas en base")
        void utilisateurIntrouvable() throws Exception {
            when(authService.login(any()))
                    .thenThrow(new RuntimeException("Utilisateur introuvable"));

            var body = """
                    {
                        "email": "inconnu@senesante.sn",
                        "password": "test123"
                    }""";

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(body))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.erreur").value("Utilisateur introuvable"));
        }

        @Test
        @DisplayName("Retourne 404 quand le mot de passe est incorrect")
        void motDePasseIncorrect() throws Exception {
            when(authService.login(any()))
                    .thenThrow(new RuntimeException("Mot de passe incorrect"));

            var body = """
                    {
                        "email": "medecin.dakar@sensante.sn",
                        "password": "mauvaisMotDePasse"
                    }""";

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(body))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.erreur").value("Mot de passe incorrect"));
        }
    }

    @Nested
    @DisplayName("Cas d'erreur de validation")
    class CasErreurValidation {

        @Test
        @DisplayName("Retourne 400 quand l'email est absent")
        void emailManquant() throws Exception {
            var body = """
                    {
                        "password": "test123"
                    }""";

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(body))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.email").exists());

            verify(authService, never()).login(any());
        }

        @Test
        @DisplayName("Retourne 400 quand le mot de passe est absent")
        void passwordManquant() throws Exception {
            var body = """
                    {
                        "email": "medecin.dakar@sensante.sn"
                    }""";

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(body))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.password").exists());

            verify(authService, never()).login(any());
        }

        @Test
        @DisplayName("Retourne 400 quand le format de l'email est invalide")
        void emailFormatInvalide() throws Exception {
            var body = """
                    {
                        "email": "pas-un-email",
                        "password": "test123"
                    }""";

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(body))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.email").exists());

            verify(authService, never()).login(any());
        }

        @Test
        @DisplayName("Retourne 400 quand le corps de la requete est vide")
        void corpsVide() throws Exception {
            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{}"))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("Cas de securite")
    class CasSecurite {

        @Test
        @DisplayName("Le endpoint /api/auth/login est accessible sans token JWT")
        void accessibleSansToken() throws Exception {
            var response = new AuthResponse("token", "user@test.sn", "AGENT", "ok");

            when(authService.login(any())).thenReturn(response);

            // Aucun header Authorization — le endpoint est permitAll()
            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("""
                                    {"email": "agent@test.sn", "password": "test123"}"""))
                    .andExpect(status().isOk());
        }
    }
}
