package com.inventario.ms_inventario.service;

import com.inventario.ms_inventario.model.Inventario;
import com.inventario.ms_inventario.repository.InventarioRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class InventarioService {

    private final InventarioRepository inventarioRepository;

    public InventarioService(InventarioRepository inventarioRepository) {
        this.inventarioRepository = inventarioRepository;
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

    public Inventario crearInventario(Inventario inventario) {

        validarInventario(inventario);

        if (inventarioRepository.existsByProductoId(inventario.getProductoId())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "El producto ya tiene un registro de inventario"
            );
        }

        inventario.setId(null);

        return inventarioRepository.save(inventario);
    }

    public Inventario actualizarInventario(Long id, Inventario datos) {

        Inventario inventario = buscarInventario(id);

        validarInventario(datos);

        if (!inventario.getProductoId().equals(datos.getProductoId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "No se puede cambiar el producto asociado al inventario"
            );
        }

        inventario.setCantidadDisponible(datos.getCantidadDisponible());
        inventario.setStockMinimo(datos.getStockMinimo());

        return inventarioRepository.save(inventario);
    }

    @Transactional
    public Inventario agregarStock(Long productoId, Integer cantidad) {

        validarCantidad(cantidad);

        Inventario inventario = buscarPorProducto(productoId);

        inventario.setCantidadDisponible(
                inventario.getCantidadDisponible() + cantidad
        );

        return inventarioRepository.save(inventario);
    }

    @Transactional
    public Inventario descontarStock(Long productoId, Integer cantidad) {

        validarCantidad(cantidad);

        Inventario inventario = buscarPorProducto(productoId);

        if (inventario.getCantidadDisponible() < cantidad) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Stock insuficiente para el producto: " + productoId
            );
        }

        inventario.setCantidadDisponible(
                inventario.getCantidadDisponible() - cantidad
        );

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

    public void eliminarInventario(Long id) {

        Inventario inventario = buscarInventario(id);

        inventarioRepository.delete(inventario);
    }

    private void validarInventario(Inventario inventario) {

        if (inventario == null ||
                inventario.getProductoId() == null ||
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