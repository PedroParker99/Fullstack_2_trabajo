package com.producto.ms_producto.service;

import com.producto.ms_producto.model.Producto;
import com.producto.ms_producto.repository.ProductoRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;

    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    public List<Producto> listarProductos() {
        return productoRepository.findAll();
    }

    public Producto buscarProducto(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Producto no encontrado con ID: " + id
                ));
    }

    public Producto guardarProducto(Producto producto) {

        if (producto.getId() == null || producto.getId() <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Debe ingresar un ID de producto mayor que cero"
            );
        }

        if (productoRepository.existsById(producto.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ya existe un producto con ID: " + producto.getId()
            );
        }

        return productoRepository.save(producto);
    }

    public Producto actualizarProducto(Long id, Producto datosProducto) {

        Producto producto = buscarProducto(id);

        producto.setNombre(datosProducto.getNombre());
        producto.setDescripcion(datosProducto.getDescripcion());
        producto.setPrecio(datosProducto.getPrecio());
        producto.setStock(datosProducto.getStock());
        producto.setImagenUrl(datosProducto.getImagenUrl());
        producto.setCategoria(datosProducto.getCategoria());

        return productoRepository.save(producto);
    }

    public void eliminarProducto(Long id) {

        Producto producto = buscarProducto(id);

        productoRepository.delete(producto);
    }
}
