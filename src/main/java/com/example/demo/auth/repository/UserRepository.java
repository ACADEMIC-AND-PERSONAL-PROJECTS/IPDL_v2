package com.example.demo.auth.repository;

import com.example.demo.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Trouver l'utilisateur selon l'email
    Optional<User> findByEmail(String email);

    // Savoir si un utilisateur avec cette email existe deja
    boolean existsByEmail(String email);

}
