package com.example.demo.auth;

import com.example.demo.auth.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // Passage au filtre suivant si ya pas le Header qu'il faut
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Recuperer le token
        String token = authHeader.substring(7);

        // Verification du token
        if (jwtService.isTokenValide(token)) {

            // Extraction des informations
            String email = jwtService.extractEmail(token);
            String role = jwtService.extractRole(token);

            // Creation de l'objet d'authentification qui represente l'utilisateur connecte
            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                    email,
                    null,
                    List.of(new SimpleGrantedAuthority("ROLE_" + role))
            );

            // Informer Spring Security que l'utilisateur est authentifier
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        // Passer au filtre suivant
        filterChain.doFilter(request, response);

    }

}