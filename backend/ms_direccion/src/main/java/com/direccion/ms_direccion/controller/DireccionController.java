package com.direccion.ms_direccion.controller;

import com.direccion.ms_direccion.model.Direccion;
import com.direccion.ms_direccion.service.DireccionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/direcciones")
public class DireccionController {

    private final DireccionService direccionService;

    public DireccionController(DireccionService direccionService) {
        this.direccionService = direccionService;
    }

    @Operation(summary = "Listar todas las direcciones")
    @GetMapping
    public List<Direccion> listarDirecciones() {
        return direccionService.listarDirecciones();
    }

    @Operation(summary = "Listar direcciones de un usuario")
    @GetMapping("/usuario/{usuarioId}")
    public List<Direccion> listarPorUsuario(@PathVariable Long usuarioId) {
        return direccionService.listarPorUsuario(usuarioId);
    }

    @Operation(summary = "Buscar dirección por ID")
    @ApiResponse(responseCode = "200", description = "Dirección encontrada")
    @ApiResponse(responseCode = "404", description = "Dirección no encontrada")
    @GetMapping("/{id}")
    public Direccion buscarDireccion(@PathVariable Long id) {
        return direccionService.buscarDireccion(id);
    }

    @Operation(summary = "Consultar dirección predeterminada de un usuario")
    @GetMapping("/usuario/{usuarioId}/predeterminada")
    public Direccion buscarPredeterminada(@PathVariable Long usuarioId) {
        return direccionService.buscarPredeterminada(usuarioId);
    }

    @Operation(summary = "Registrar una nueva dirección")
    @ApiResponse(responseCode = "201", description = "Dirección registrada")
    @ApiResponse(responseCode = "400", description = "Datos inválidos")
    @PostMapping
    public ResponseEntity<Direccion> crearDireccion(
            @Valid @RequestBody Direccion direccion) {

        Direccion nuevaDireccion = direccionService.crearDireccion(direccion);

        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaDireccion);
    }

    @Operation(summary = "Actualizar una dirección")
    @ApiResponse(responseCode = "200", description = "Dirección actualizada")
    @ApiResponse(responseCode = "404", description = "Dirección no encontrada")
    @PutMapping("/{id}")
    public Direccion actualizarDireccion(
            @PathVariable Long id,
            @Valid @RequestBody Direccion direccion) {

        return direccionService.actualizarDireccion(id, direccion);
    }

    @Operation(summary = "Establecer una dirección como predeterminada")
    @PatchMapping("/{id}/predeterminada")
    public Direccion establecerPredeterminada(@PathVariable Long id) {
        return direccionService.establecerPredeterminada(id);
    }

    @Operation(summary = "Eliminar una dirección")
    @ApiResponse(responseCode = "204", description = "Dirección eliminada")
    @ApiResponse(responseCode = "404", description = "Dirección no encontrada")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarDireccion(@PathVariable Long id) {

        direccionService.eliminarDireccion(id);

        return ResponseEntity.noContent().build();
    }
}