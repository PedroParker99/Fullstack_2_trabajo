package com.usuario.ms_usuario.favorito.repository;

import com.usuario.ms_usuario.favorito.model.Favorito;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoritoRepository extends JpaRepository<Favorito, Long> {

    List<Favorito> findByUsuarioId(Long usuarioId);

    Optional<Favorito> findByUsuarioIdAndProductoId(
            Long usuarioId,
            Long productoId
    );

    boolean existsByUsuarioIdAndProductoId(
            Long usuarioId,
            Long productoId
    );

}