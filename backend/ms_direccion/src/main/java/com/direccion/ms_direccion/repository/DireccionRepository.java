package com.direccion.ms_direccion.repository;

import com.direccion.ms_direccion.model.Direccion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DireccionRepository extends JpaRepository<Direccion, Long> {

    List<Direccion> findByUsuarioId(Long usuarioId);

    Optional<Direccion> findByUsuarioIdAndPredeterminadaTrue(Long usuarioId);

    boolean existsByUsuarioId(Long usuarioId);

}