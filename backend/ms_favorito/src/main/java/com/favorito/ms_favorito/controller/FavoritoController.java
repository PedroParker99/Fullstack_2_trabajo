package com.favorito.ms_favorito.controller;

import com.favorito.ms_favorito.model.Favorito;
import com.favorito.ms_favorito.service.FavoritoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favoritos")
public class FavoritoController {

    private final FavoritoService favoritoService;

    public FavoritoController(FavoritoService favoritoService) {
        this.favoritoService = favoritoService;
    }

    @Operation(summary = "Listar todos los favoritos")
    @GetMapping
    public List<Favorito> listarFavoritos() {
        return favoritoService.listarFavoritos();
    }

    @Operation(summary = "Listar favoritos de un usuario")
    @GetMapping("/usuario/{usuarioId}")
    public List<Favorito> listarPorUsuario(@PathVariable Long usuarioId) {
        return favoritoService.listarPorUsuario(usuarioId);
    }

    @Operation(summary = "Buscar favorito por ID")
    @ApiResponse(responseCode = "200", description = "Favorito encontrado")
    @ApiResponse(responseCode = "404", description = "Favorito no encontrado")
    @GetMapping("/{id}")
    public Favorito buscarFavorito(@PathVariable Long id) {
        return favoritoService.buscarFavorito(id);
    }

    @Operation(summary = "Agregar producto a favoritos")
    @ApiResponse(responseCode = "201", description = "Favorito agregado")
    @ApiResponse(responseCode = "400", description = "Datos inválidos")
    @ApiResponse(responseCode = "409", description = "El producto ya está en favoritos")
    @PostMapping
    public ResponseEntity<Favorito> agregarFavorito(
            @Valid @RequestBody Favorito favorito) {

        Favorito nuevoFavorito = favoritoService.agregarFavorito(favorito);

        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoFavorito);
    }

    @Operation(summary = "Eliminar favorito por ID")
    @ApiResponse(responseCode = "204", description = "Favorito eliminado")
    @ApiResponse(responseCode = "404", description = "Favorito no encontrado")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarFavorito(@PathVariable Long id) {

        favoritoService.eliminarFavorito(id);

        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Eliminar un producto de los favoritos de un usuario")
    @ApiResponse(responseCode = "204", description = "Producto eliminado de favoritos")
    @ApiResponse(responseCode = "404", description = "El producto no está en favoritos")
    @DeleteMapping("/usuario/{usuarioId}/producto/{productoId}")
    public ResponseEntity<Void> eliminarPorUsuarioYProducto(
            @PathVariable Long usuarioId,
            @PathVariable Long productoId) {

        favoritoService.eliminarPorUsuarioYProducto(usuarioId, productoId);

        return ResponseEntity.noContent().build();
    }
}