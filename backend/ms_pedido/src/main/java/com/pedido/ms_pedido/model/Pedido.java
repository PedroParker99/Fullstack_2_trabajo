package com.pedido.ms_pedido.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import io.swagger.v3.oas.annotations.media.Schema;

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
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @NotNull(message = "El ID del usuario es obligatorio")
    private Long usuarioId;

    @NotNull(message = "El ID de la dirección es obligatorio")
    @Column(name = "direccion_id")
    private Long direccionId;

    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime fechaPedido;

    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private String estado;

    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    @Column(precision = 12, scale = 2)
    private BigDecimal total;

    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private String direccionEntrega;
}