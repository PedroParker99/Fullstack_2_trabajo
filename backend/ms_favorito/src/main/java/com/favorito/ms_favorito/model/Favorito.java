package com.favorito.ms_favorito.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "favoritos",
    uniqueConstraints = @UniqueConstraint(
        columnNames = {"usuario_id", "producto_id"}
    )
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Favorito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "El ID del usuario es obligatorio")
    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @NotNull(message = "El ID del producto es obligatorio")
    @Column(name = "producto_id", nullable = false)
    private Long productoId;

    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaAgregado;

    @PrePersist
    public void asignarFecha() {
        fechaAgregado = LocalDateTime.now();
    }
}