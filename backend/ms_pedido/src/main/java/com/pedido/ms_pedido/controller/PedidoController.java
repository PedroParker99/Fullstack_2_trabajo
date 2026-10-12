package com.pedido.ms_pedido.controller;

import com.pedido.ms_pedido.model.DetallePedido;
import com.pedido.ms_pedido.model.Pedido;
import com.pedido.ms_pedido.service.PedidoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    public record CrearPedidoRequest(
            @Valid Pedido pedido,
            List<@Valid DetallePedido> detalles
    ) {
    }

    public record ActualizarEstadoRequest(String estado) {
    }

    @Operation(summary = "Listar todos los pedidos")
    @GetMapping
    public List<Pedido> listarPedidos() {
        return pedidoService.listarPedidos();
    }

    @Operation(summary = "Buscar un pedido por ID")
    @ApiResponse(responseCode = "200", description = "Pedido encontrado")
    @ApiResponse(responseCode = "404", description = "Pedido no encontrado")
    @GetMapping("/{id}")
    public Pedido buscarPedido(@PathVariable Long id) {
        return pedidoService.buscarPedido(id);
    }

    @Operation(summary = "Buscar pedidos de un usuario")
    @GetMapping("/usuario/{usuarioId}")
    public List<Pedido> buscarPedidosPorUsuario(@PathVariable Long usuarioId) {
        return pedidoService.buscarPedidosPorUsuario(usuarioId);
    }

    @Operation(summary = "Consultar los productos de un pedido")
    @GetMapping("/{id}/detalles")
    public List<DetallePedido> listarDetalles(@PathVariable Long id) {
        return pedidoService.listarDetalles(id);
    }

    @Operation(summary = "Crear un pedido con sus productos")
    @ApiResponse(responseCode = "201", description = "Pedido creado")
    @ApiResponse(responseCode = "400", description = "Datos inválidos")
    @PostMapping
    public ResponseEntity<Pedido> crearPedido(
            @RequestBody CrearPedidoRequest solicitud) {

        Pedido nuevoPedido = pedidoService.crearPedido(
                solicitud.pedido(),
                solicitud.detalles()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoPedido);
    }

    @Operation(summary = "Actualizar el estado de un pedido")
    @ApiResponse(responseCode = "200", description = "Estado actualizado")
    @ApiResponse(responseCode = "400", description = "Estado inválido")
    @ApiResponse(responseCode = "404", description = "Pedido no encontrado")
    @PatchMapping("/{id}/estado")
    public Pedido actualizarEstado(
            @PathVariable Long id,
            @RequestBody ActualizarEstadoRequest solicitud) {

        return pedidoService.actualizarEstado(id, solicitud.estado());
    }

    @Operation(summary = "Eliminar un pedido")
    @ApiResponse(responseCode = "204", description = "Pedido eliminado")
    @ApiResponse(responseCode = "404", description = "Pedido no encontrado")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPedido(@PathVariable Long id) {
        pedidoService.eliminarPedido(id);
        return ResponseEntity.noContent().build();
    }
}