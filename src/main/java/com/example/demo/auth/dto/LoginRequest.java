package com.example.demo.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @Email
    @NotBlank(message = "Veuillez indiquer votre email svp!")
    private String email;

    @NotBlank(message = "Veuillez indiquer votre mot de passe svp!")
    private String password;

}