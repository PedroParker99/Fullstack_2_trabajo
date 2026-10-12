package com.pedido.ms_pedido.service;

import com.pedido.ms_pedido.model.DetallePedido;
import com.pedido.ms_pedido.model.Pedido;
import com.pedido.ms_pedido.repository.DetallePedidoRepository;
import com.pedido.ms_pedido.repository.PedidoRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final DetallePedidoRepository detallePedidoRepository;

    public PedidoService(
            PedidoRepository pedidoRepository,
            DetallePedidoRepository detallePedidoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.detallePedidoRepository = detallePedidoRepository;
    }

    public List<Pedido> listarPedidos() {
        return pedidoRepository.findAll();
    }

    public Pedido buscarPedido(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Pedido no encontrado con ID: " + id
                ));
    }

    public List<Pedido> buscarPedidosPorUsuario(Long usuarioId) {
        return pedidoRepository.findByUsuarioId(usuarioId);
    }

    public List<DetallePedido> listarDetalles(Long pedidoId) {
        buscarPedido(pedidoId);
        return detallePedidoRepository.findByPedidoId(pedidoId);
    }

    @Transactional
    public Pedido crearPedido(Pedido pedido, List<DetallePedido> detalles) {

        if (pedido.getUsuarioId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El usuario es obligatorio"
            );
        }

        if (detalles == null || detalles.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El pedido debe contener al menos un producto"
            );
        }

        BigDecimal total = BigDecimal.ZERO;

        for (DetallePedido detalle : detalles) {

            if (detalle.getProductoId() == null ||
                    detalle.getCantidad() == null ||
                    detalle.getCantidad() <= 0 ||
                    detalle.getPrecioUnitario() == null ||
                    detalle.getPrecioUnitario().compareTo(BigDecimal.ZERO) <= 0) {

                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Los datos de los productos son inválidos"
                );
            }

            BigDecimal subtotal = detalle.getPrecioUnitario()
                    .multiply(BigDecimal.valueOf(detalle.getCantidad()));

            detalle.setSubtotal(subtotal);
            total = total.add(subtotal);
        }

        pedido.setId(null);
        pedido.setFechaPedido(LocalDateTime.now());
        pedido.setEstado("PENDIENTE");
        pedido.setTotal(total);

        Pedido nuevoPedido = pedidoRepository.save(pedido);

        for (DetallePedido detalle : detalles) {
            detalle.setId(null);
            detalle.setPedidoId(nuevoPedido.getId());
            detallePedidoRepository.save(detalle);
        }

        return nuevoPedido;
    }

    public Pedido actualizarEstado(Long id, String estado) {

        Pedido pedido = buscarPedido(id);

        if (estado == null ||
                !List.of("PENDIENTE", "CONFIRMADO", "EN_PREPARACION",
                        "ENVIADO", "ENTREGADO", "CANCELADO").contains(estado)) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Estado de pedido inválido"
            );
        }

        pedido.setEstado(estado);

        return pedidoRepository.save(pedido);
    }

    @Transactional
    public void eliminarPedido(Long id) {

        buscarPedido(id);

        detallePedidoRepository.deleteByPedidoId(id);
        pedidoRepository.deleteById(id);
    }
}