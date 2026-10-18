package com.pedido.ms_pedido.service;

import com.pedido.ms_pedido.model.DetallePedido;
import com.pedido.ms_pedido.model.Pedido;
import com.pedido.ms_pedido.repository.DetallePedidoRepository;
import com.pedido.ms_pedido.repository.PedidoRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final DetallePedidoRepository detallePedidoRepository;
    private final TransactionTemplate transactionTemplate;

    private final RestClient usuarioClient = RestClient.create("http://localhost:8082");
    private final RestClient productoClient = RestClient.create("http://localhost:8081");
    private final RestClient direccionClient = RestClient.create("http://localhost:8086");

    public PedidoService(PedidoRepository pedidoRepository,
                         DetallePedidoRepository detallePedidoRepository,
                         PlatformTransactionManager transactionManager) {
        this.pedidoRepository = pedidoRepository;
        this.detallePedidoRepository = detallePedidoRepository;
        this.transactionTemplate = new TransactionTemplate(transactionManager);
    }

    private record ProductoResponse(Long id, String nombre, Integer precio, Integer stock) {}
    private record DireccionResponse(
            Long id,
            Long usuarioId,
            String calle,
            String numero,
            String departamento,
            String comuna,
            String ciudad,
            String region
    ) {}
    private record MovimientoStockRequest(Integer cantidad) {}

    private ResponseStatusException error(HttpStatus estado, String mensaje) {
        return new ResponseStatusException(estado, mensaje);
    }

    private void moverStock(Long productoId, Integer cantidad, boolean descontar) {
        String accion = descontar ? "descontar" : "agregar";

        try {
            productoClient.patch()
                    .uri("/api/inventarios/producto/{id}/" + accion, productoId)
                    .body(new MovimientoStockRequest(cantidad))
                    .retrieve()
                    .toBodilessEntity();

        } catch (HttpClientErrorException.Conflict e) {
            throw error(HttpStatus.CONFLICT, "Stock insuficiente para el producto: " + productoId);

        } catch (HttpClientErrorException.NotFound e) {
            throw error(HttpStatus.BAD_REQUEST, "No existe inventario para el producto: " + productoId);

        } catch (RestClientException e) {
            e.printStackTrace();
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "No se pudo confirmar el movimiento de stock del producto: " + productoId,
                    e
            );
        }
    }

    private void verificarUsuario(Long usuarioId) {
        try {
            usuarioClient.get()
                    .uri("/api/usuarios/{id}", usuarioId)
                    .retrieve()
                    .toBodilessEntity();

        } catch (HttpClientErrorException.NotFound e) {
            throw error(HttpStatus.BAD_REQUEST, "El usuario indicado no existe");

        } catch (RestClientException e) {
            e.printStackTrace();
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "No se pudo verificar el usuario",
                    e
            );
        }

        }

        private DireccionResponse verificarDireccion(Long direccionId, Long usuarioId) {
        if (direccionId == null || direccionId <= 0) {
            throw error(HttpStatus.BAD_REQUEST, "Debe indicar un ID de dirección válido");
        }

        DireccionResponse direccion;

        try {
            direccion = direccionClient.get()
                    .uri("/api/direcciones/{id}", direccionId)
                    .retrieve()
                    .body(DireccionResponse.class);

        } catch (HttpClientErrorException.NotFound e) {
            throw error(HttpStatus.BAD_REQUEST, "La dirección indicada no existe");

        } catch (RestClientException e) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "No se pudo verificar la dirección de entrega",
                    e
            );
        }

        if (direccion == null || direccion.usuarioId() == null ||
                !direccion.usuarioId().equals(usuarioId)) {
            throw error(HttpStatus.BAD_REQUEST, "La dirección no pertenece al usuario indicado");
        }

        return direccion;
    }

    private ProductoResponse obtenerProducto(Long productoId) {
        ProductoResponse producto;

        try {
            producto = productoClient.get()
                    .uri("/api/productos/{id}", productoId)
                    .retrieve()
                    .body(ProductoResponse.class);

        } catch (HttpClientErrorException.NotFound e) {
            throw error(HttpStatus.BAD_REQUEST, "El producto con ID " + productoId + " no existe");

        } catch (RestClientException e) {
            e.printStackTrace();
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "No se pudo verificar el producto",
                    e
            );
        }

        if (producto == null || producto.precio() == null || producto.precio() <= 0) {
            throw error(HttpStatus.BAD_REQUEST, "El producto no tiene un precio válido");
        }

        return producto;
    }

    private Map<Long, Integer> agruparCantidades(List<DetallePedido> detalles) {
        Map<Long, Integer> cantidades = new HashMap<>();

        for (DetallePedido detalle : detalles) {
            if (detalle == null || detalle.getProductoId() == null ||
                    detalle.getProductoId() <= 0 || detalle.getCantidad() == null ||
                    detalle.getCantidad() <= 0) {
                throw error(HttpStatus.BAD_REQUEST, "El producto y la cantidad deben ser válidos");
            }

            try {
                cantidades.merge(detalle.getProductoId(), detalle.getCantidad(), Math::addExact);
            } catch (ArithmeticException e) {
                throw error(HttpStatus.BAD_REQUEST, "La cantidad solicitada es demasiado grande");
            }
        }

        return cantidades;
    }

    private void compensarStock(Map<Long, Integer> cantidades,
                                List<Long> productos, boolean descontar) {
        boolean fallo = false;

        for (Long productoId : productos) {
            try {
                moverStock(productoId, cantidades.get(productoId), descontar);
            } catch (RuntimeException e) {
                e.printStackTrace();
                fallo = true;
            }
        }

        if (fallo) {
            throw error(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "No se pudo completar la compensación del inventario. Revise el stock antes de reintentar."
            );
        }
    }

    public List<Pedido> listarPedidos() {
        return pedidoRepository.findAll();
    }

    public Pedido buscarPedido(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> error(HttpStatus.NOT_FOUND, "Pedido no encontrado con ID: " + id));
    }

    public List<Pedido> buscarPedidosPorUsuario(Long usuarioId) {
        return pedidoRepository.findByUsuarioId(usuarioId);
    }

    public boolean direccionTienePedidos(Long direccionId) {
        return pedidoRepository.existsByDireccionId(direccionId);
    }

    public List<DetallePedido> listarDetalles(Long pedidoId) {
        buscarPedido(pedidoId);
        return detallePedidoRepository.findByPedidoId(pedidoId);
    }

    public Pedido crearPedido(Pedido pedido, List<DetallePedido> detalles) {
        if (pedido == null || pedido.getUsuarioId() == null || pedido.getUsuarioId() <= 0) {
            throw error(HttpStatus.BAD_REQUEST, "Debe indicar un usuario válido");
        }

        verificarUsuario(pedido.getUsuarioId());

        DireccionResponse direccion = verificarDireccion(
                pedido.getDireccionId(),
                pedido.getUsuarioId()
        );

        String direccionCompleta = direccion.calle() + " " + direccion.numero();

        if (direccion.departamento() != null && !direccion.departamento().isBlank()) {
            direccionCompleta += ", " + direccion.departamento();
        }

        direccionCompleta += ", " + direccion.comuna()
                + ", " + direccion.ciudad()
                + ", " + direccion.region();

        pedido.setDireccionEntrega(direccionCompleta);

        verificarUsuario(pedido.getUsuarioId());

        if (detalles == null || detalles.isEmpty()) {
            throw error(HttpStatus.BAD_REQUEST, "El pedido debe contener al menos un producto");
        }

        Map<Long, Integer> cantidades = agruparCantidades(detalles);
        Map<Long, ProductoResponse> productos = new HashMap<>();
        BigDecimal total = BigDecimal.ZERO;

        for (DetallePedido detalle : detalles) {
            Long productoId = detalle.getProductoId();
            ProductoResponse producto = productos.computeIfAbsent(productoId, this::obtenerProducto);

            if (producto.stock() == null || producto.stock() < cantidades.get(productoId)) {
                throw error(HttpStatus.CONFLICT, "Stock insuficiente para el producto: " + productoId);
            }

            BigDecimal precio = BigDecimal.valueOf(producto.precio());
            detalle.setPrecioUnitario(precio);
            detalle.setSubtotal(precio.multiply(BigDecimal.valueOf(detalle.getCantidad())));
            total = total.add(detalle.getSubtotal());
        }

        pedido.setId(null);
        pedido.setFechaPedido(LocalDateTime.now());
        pedido.setEstado("PENDIENTE");
        pedido.setTotal(total);

        List<Long> descontados = new ArrayList<>();

        try {
            for (Map.Entry<Long, Integer> entrada : cantidades.entrySet()) {
                moverStock(entrada.getKey(), entrada.getValue(), true);
                descontados.add(entrada.getKey());
            }

            return transactionTemplate.execute(status -> {
                Pedido nuevo = pedidoRepository.saveAndFlush(pedido);

                for (DetallePedido detalle : detalles) {
                    detalle.setId(null);
                    detalle.setPedidoId(nuevo.getId());
                }

                detallePedidoRepository.saveAllAndFlush(detalles);
                return nuevo;
            });

        } catch (RuntimeException e) {
            compensarStock(cantidades, descontados, false);
            throw e;
        }
    }

    public Pedido actualizarEstado(Long id, String estado) {
        List<String> estados = List.of(
                "PENDIENTE", "CONFIRMADO", "EN_PREPARACION",
                "ENVIADO", "ENTREGADO", "CANCELADO"
        );

        if (estado == null || !estados.contains(estado)) {
            throw error(HttpStatus.BAD_REQUEST, "Estado de pedido inválido");
        }

        Pedido pedido = buscarPedido(id);
        String actual = pedido.getEstado();

        if ("CANCELADO".equals(actual)) {
            throw error(HttpStatus.CONFLICT, "Un pedido cancelado no puede cambiar de estado");
        }

        if (estado.equals(actual)) {
            return pedido;
        }

        if ("CANCELADO".equals(estado)) {
            if ("ENVIADO".equals(actual) || "ENTREGADO".equals(actual)) {
                throw error(HttpStatus.CONFLICT, "No se puede cancelar un pedido enviado o entregado");
            }

            Map<Long, Integer> cantidades = agruparCantidades(
                    detallePedidoRepository.findByPedidoId(id)
            );

            List<Long> devueltos = new ArrayList<>();

            try {
                for (Map.Entry<Long, Integer> entrada : cantidades.entrySet()) {
                    moverStock(entrada.getKey(), entrada.getValue(), false);
                    devueltos.add(entrada.getKey());
                }

                return transactionTemplate.execute(status -> {
                    pedido.setEstado("CANCELADO");
                    return pedidoRepository.saveAndFlush(pedido);
                });

            } catch (RuntimeException e) {
                compensarStock(cantidades, devueltos, true);
                throw e;
            }
        }

        pedido.setEstado(estado);
        return pedidoRepository.save(pedido);
    }

    @Transactional
    public void eliminarPedido(Long id) {
        Pedido pedido = buscarPedido(id);

        if (!"CANCELADO".equals(pedido.getEstado())) {
            throw error(HttpStatus.CONFLICT, "Debe cancelar el pedido antes de eliminarlo");
        }

        detallePedidoRepository.deleteByPedidoId(id);
        pedidoRepository.deleteById(id);
    }
}