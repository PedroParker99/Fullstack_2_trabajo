package com.producto.ms_producto.inventario.repository;

import com.producto.ms_producto.inventario.model.Inventario;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;

import java.util.List;
import java.util.Optional;

public interface InventarioRepository extends JpaRepository<Inventario, Long> {

    Optional<Inventario> findByProductoId(Long productoId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT i FROM Inventario i WHERE i.productoId = :productoId")
    Optional<Inventario> findByProductoIdParaActualizar(
            @Param("productoId") Long productoId
    );

    boolean existsByProductoId(Long productoId);

    List<Inventario> findByCantidadDisponibleLessThanEqual(Integer cantidad);
}