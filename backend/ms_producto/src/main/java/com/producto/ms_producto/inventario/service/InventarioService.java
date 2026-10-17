package com.producto.ms_producto.inventario.service;

import com.producto.ms_producto.inventario.model.Inventario;
import com.producto.ms_producto.inventario.repository.InventarioRepository;
import com.producto.ms_producto.model.Producto;
import com.producto.ms_producto.repository.ProductoRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class InventarioService {

    private final InventarioRepository inventarioRepository;
    private final ProductoRepository productoRepository;

    public InventarioService(
            InventarioRepository inventarioRepository,
            ProductoRepository productoRepository) {
        this.inventarioRepository = inventarioRepository;
        this.productoRepository = productoRepository;
    }

    public List<Inventario> listarInventarios() {
        return inventarioRepository.findAll();
    }

    public Inventario buscarInventario(Long id) {
        return inventarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Inventario no encontrado con ID: " + id
                ));
    }

    public Inventario buscarPorProducto(Long productoId) {
        return inventarioRepository.findByProductoId(productoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Inventario no encontrado para el producto: " + productoId
                ));
    }

    @Transactional
    public Inventario crearInventario(Inventario inventario) {

        validarInventario(inventario);

        if (inventarioRepository.existsById(inventario.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ya existe un inventario con ID: " + inventario.getId()
            );
        }

        if (inventarioRepository.existsByProductoId(inventario.getProductoId())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "El producto ya tiene un registro de inventario"
            );
        }

        Producto producto = buscarProducto(inventario.getProductoId());

        producto.setStock(inventario.getCantidadDisponible());

        productoRepository.save(producto);

        return inventarioRepository.save(inventario);
    }

    @Transactional
    public Inventario actualizarInventario(Long id, Inventario datos) {

        validarInventario(datos);

        Inventario inventario = inventarioRepository
                .findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Inventario no encontrado con ID: " + id
                ));

        if (!inventario.getId().equals(datos.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "No se puede cambiar el ID del inventario"
            );
        }

        if (!inventario.getProductoId().equals(datos.getProductoId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "No se puede cambiar el producto asociado al inventario"
            );
        }

        inventario = bloquearInventario(inventario.getProductoId());

        Producto producto = buscarProducto(inventario.getProductoId());

        inventario.setCantidadDisponible(datos.getCantidadDisponible());
        inventario.setStockMinimo(datos.getStockMinimo());

        producto.setStock(datos.getCantidadDisponible());

        productoRepository.save(producto);

        return inventarioRepository.save(inventario);
    }

    @Transactional
    public Inventario agregarStock(Long productoId, Integer cantidad) {

        validarCantidad(cantidad);

        Inventario inventario = bloquearInventario(productoId);
        Producto producto = buscarProducto(productoId);

        int nuevoStock;

        try {
            nuevoStock = Math.addExact(
                    inventario.getCantidadDisponible(),
                    cantidad
            );
        } catch (ArithmeticException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La cantidad supera el límite permitido"
            );
        }

        inventario.setCantidadDisponible(nuevoStock);
        producto.setStock(nuevoStock);

        productoRepository.save(producto);

        return inventarioRepository.save(inventario);
    }

    @Transactional
    public Inventario descontarStock(Long productoId, Integer cantidad) {

        validarCantidad(cantidad);

        Inventario inventario = bloquearInventario(productoId);
        Producto producto = buscarProducto(productoId);

        if (inventario.getCantidadDisponible() < cantidad) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Stock insuficiente para el producto: " + productoId
            );
        }

        int nuevoStock = inventario.getCantidadDisponible() - cantidad;

        inventario.setCantidadDisponible(nuevoStock);
        producto.setStock(nuevoStock);

        productoRepository.save(producto);

        return inventarioRepository.save(inventario);
    }

    public List<Inventario> listarStockBajo() {
        return inventarioRepository.findAll()
                .stream()
                .filter(inventario ->
                        inventario.getCantidadDisponible()
                                <= inventario.getStockMinimo()
                )
                .toList();
    }

    @Transactional
    public void eliminarInventario(Long id) {

        Inventario inventario = buscarInventario(id);

        inventarioRepository.delete(inventario);
    }

    private Inventario bloquearInventario(Long productoId) {
        return inventarioRepository
                .findByProductoIdParaActualizar(productoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Inventario no encontrado para el producto: " + productoId
                ));
    }

    private Producto buscarProducto(Long productoId) {
        return productoRepository.findById(productoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Producto no encontrado con ID: " + productoId
                ));
    }

    private void validarInventario(Inventario inventario) {

        if (inventario == null ||
                inventario.getId() == null ||
                inventario.getId() <= 0 ||
                inventario.getProductoId() == null ||
                inventario.getProductoId() <= 0 ||
                inventario.getCantidadDisponible() == null ||
                inventario.getCantidadDisponible() < 0 ||
                inventario.getStockMinimo() == null ||
                inventario.getStockMinimo() < 0) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Los datos del inventario son inválidos"
            );
        }
    }

    private void validarCantidad(Integer cantidad) {

        if (cantidad == null || cantidad <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La cantidad debe ser mayor que cero"
            );
        }
    }
}