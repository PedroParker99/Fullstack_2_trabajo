package com.inventario.ms_inventario.repository;

import com.inventario.ms_inventario.model.Inventario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InventarioRepository extends JpaRepository<Inventario, Long> {

    Optional<Inventario> findByProductoId(Long productoId);

    boolean existsByProductoId(Long productoId);

    List<Inventario> findByCantidadDisponibleLessThanEqual(Integer cantidad);

}