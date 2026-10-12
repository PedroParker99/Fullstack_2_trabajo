package com.inventario.ms_inventario.controller;

import com.inventario.ms_inventario.model.Inventario;
import com.inventario.ms_inventario.service.InventarioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventarios")
public class InventarioController {

    private final InventarioService inventarioService;

    public InventarioController(InventarioService inventarioService) {
        this.inventarioService = inventarioService;
    }

    public record MovimientoStockRequest(
            @NotNull
            @Positive
            Integer cantidad
    ) {
    }

    @Operation(summary = "Listar todos los inventarios")
    @GetMapping
    public List<Inventario> listarInventarios() {
        return inventarioService.listarInventarios();
    }

    @Operation(summary = "Buscar inventario por ID")
    @ApiResponse(responseCode = "200", description = "Inventario encontrado")
    @ApiResponse(responseCode = "404", description = "Inventario no encontrado")
    @GetMapping("/{id}")
    public Inventario buscarInventario(@PathVariable Long id) {
        return inventarioService.buscarInventario(id);
    }

    @Operation(summary = "Buscar inventario por ID de producto")
    @GetMapping("/producto/{productoId}")
    public Inventario buscarPorProducto(@PathVariable Long productoId) {
        return inventarioService.buscarPorProducto(productoId);
    }

    @Operation(summary = "Consultar productos con stock bajo")
    @GetMapping("/stock-bajo")
    public List<Inventario> listarStockBajo() {
        return inventarioService.listarStockBajo();
    }

    @Operation(summary = "Registrar inventario")
    @ApiResponse(responseCode = "201", description = "Inventario registrado")
    @ApiResponse(responseCode = "400", description = "Datos inválidos")
    @ApiResponse(responseCode = "409", description = "El producto ya tiene inventario")
    @PostMapping
    public ResponseEntity<Inventario> crearInventario(
            @Valid @RequestBody Inventario inventario) {

        Inventario nuevoInventario = inventarioService.crearInventario(inventario);

        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoInventario);
    }

    @Operation(summary = "Actualizar inventario")
    @PutMapping("/{id}")
    public Inventario actualizarInventario(
            @PathVariable Long id,
            @Valid @RequestBody Inventario inventario) {

        return inventarioService.actualizarInventario(id, inventario);
    }

    @Operation(summary = "Agregar unidades al stock")
    @PatchMapping("/producto/{productoId}/agregar")
    public Inventario agregarStock(
            @PathVariable Long productoId,
            @Valid @RequestBody MovimientoStockRequest solicitud) {

        return inventarioService.agregarStock(
                productoId,
                solicitud.cantidad()
        );
    }

    @Operation(summary = "Descontar unidades del stock")
    @ApiResponse(responseCode = "200", description = "Stock descontado")
    @ApiResponse(responseCode = "409", description = "Stock insuficiente")
    @PatchMapping("/producto/{productoId}/descontar")
    public Inventario descontarStock(
            @PathVariable Long productoId,
            @Valid @RequestBody MovimientoStockRequest solicitud) {

        return inventarioService.descontarStock(
                productoId,
                solicitud.cantidad()
        );
    }

    @Operation(summary = "Eliminar inventario")
    @ApiResponse(responseCode = "204", description = "Inventario eliminado")
    @ApiResponse(responseCode = "404", description = "Inventario no encontrado")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarInventario(@PathVariable Long id) {

        inventarioService.eliminarInventario(id);

        return ResponseEntity.noContent().build();
    }
}