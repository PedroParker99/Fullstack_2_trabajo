package com.pedido.ms_pedido.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pedidos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "El ID del usuario es obligatorio")
    private Long usuarioId;

    private LocalDateTime fechaPedido;

    private String estado;

    @NotNull(message = "El total es obligatorio")
    @Positive(message = "El total debe ser mayor que cero")
    @Column(precision = 12, scale = 2)
    private BigDecimal total;

    private String direccionEntrega;
}