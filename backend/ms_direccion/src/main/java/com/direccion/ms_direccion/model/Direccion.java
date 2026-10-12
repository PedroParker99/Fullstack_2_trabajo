package com.direccion.ms_direccion.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "direcciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Direccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "El ID del usuario es obligatorio")
    @Positive(message = "El ID del usuario debe ser positivo")
    @Column(nullable = false)
    private Long usuarioId;

    @NotBlank(message = "La calle es obligatoria")
    @Column(nullable = false)
    private String calle;

    @NotBlank(message = "El número es obligatorio")
    @Column(nullable = false)
    private String numero;

    private String departamento;

    @NotBlank(message = "La comuna es obligatoria")
    @Column(nullable = false)
    private String comuna;

    @NotBlank(message = "La ciudad es obligatoria")
    @Column(nullable = false)
    private String ciudad;

    @NotBlank(message = "La región es obligatoria")
    @Column(nullable = false)
    private String region;

    private String referencia;

    private Boolean predeterminada = false;
}