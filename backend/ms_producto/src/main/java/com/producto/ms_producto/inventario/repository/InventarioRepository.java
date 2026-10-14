package com.producto.ms_producto.inventario.repository;

import com.producto.ms_producto.inventario.model.Inventario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InventarioRepository extends JpaRepository<Inventario, Long> {

    Optional<Inventario> findByProductoId(Long productoId);

    boolean existsByProductoId(Long productoId);

    List<Inventario> findByCantidadDisponibleLessThanEqual(Integer cantidad);

}