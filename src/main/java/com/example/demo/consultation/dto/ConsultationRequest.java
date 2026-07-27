package com.example.demo.consultation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ConsultationRequest {

    @NotNull(message = "Le patient est obligatoire")
    private Long patientId;

    @NotBlank(message = "Les symptomes sont obligatoires")
    private String symptomes;

    private String notes;

}
