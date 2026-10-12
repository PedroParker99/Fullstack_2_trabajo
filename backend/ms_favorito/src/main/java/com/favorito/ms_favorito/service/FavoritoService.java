package com.favorito.ms_favorito.service;

import com.favorito.ms_favorito.model.Favorito;
import com.favorito.ms_favorito.repository.FavoritoRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class FavoritoService {

    private final FavoritoRepository favoritoRepository;

    public FavoritoService(FavoritoRepository favoritoRepository) {
        this.favoritoRepository = favoritoRepository;
    }

    public List<Favorito> listarFavoritos() {
        return favoritoRepository.findAll();
    }

    public List<Favorito> listarPorUsuario(Long usuarioId) {
        return favoritoRepository.findByUsuarioId(usuarioId);
    }

    public Favorito buscarFavorito(Long id) {
        return favoritoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Favorito no encontrado con ID: " + id
                ));
    }

    public Favorito agregarFavorito(Favorito favorito) {

        if (favorito == null ||
                favorito.getUsuarioId() == null ||
                favorito.getProductoId() == null ||
                favorito.getUsuarioId() <= 0 ||
                favorito.getProductoId() <= 0) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Los datos del favorito son inválidos"
            );
        }

        if (favoritoRepository.existsByUsuarioIdAndProductoId(
                favorito.getUsuarioId(),
                favorito.getProductoId())) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "El producto ya está en los favoritos del usuario"
            );
        }

        favorito.setId(null);
        favorito.setFechaAgregado(null);

        return favoritoRepository.save(favorito);
    }

    public void eliminarFavorito(Long id) {

        Favorito favorito = buscarFavorito(id);

        favoritoRepository.delete(favorito);
    }

    public void eliminarPorUsuarioYProducto(Long usuarioId, Long productoId) {

        Favorito favorito = favoritoRepository
                .findByUsuarioIdAndProductoId(usuarioId, productoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "El producto no está en los favoritos del usuario"
                ));

        favoritoRepository.delete(favorito);
    }
}