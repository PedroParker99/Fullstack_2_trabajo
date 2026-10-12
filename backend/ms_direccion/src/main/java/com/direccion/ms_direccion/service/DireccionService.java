package com.direccion.ms_direccion.service;

import com.direccion.ms_direccion.model.Direccion;
import com.direccion.ms_direccion.repository.DireccionRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class DireccionService {

    private final DireccionRepository direccionRepository;

    public DireccionService(DireccionRepository direccionRepository) {
        this.direccionRepository = direccionRepository;
    }

    public List<Direccion> listarDirecciones() {
        return direccionRepository.findAll();
    }

    public List<Direccion> listarPorUsuario(Long usuarioId) {
        return direccionRepository.findByUsuarioId(usuarioId);
    }

    public Direccion buscarDireccion(Long id) {
        return direccionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Dirección no encontrada con ID: " + id
                ));
    }

    public Direccion buscarPredeterminada(Long usuarioId) {
        return direccionRepository
                .findByUsuarioIdAndPredeterminadaTrue(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "El usuario no tiene una dirección predeterminada"
                ));
    }

    @Transactional
    public Direccion crearDireccion(Direccion direccion) {

        direccion.setId(null);

        if (direccion.getUsuarioId() == null || direccion.getUsuarioId() <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El ID del usuario debe ser válido"
            );
        }

        if (!direccionRepository.existsByUsuarioId(direccion.getUsuarioId())) {
            direccion.setPredeterminada(true);
        } else if (Boolean.TRUE.equals(direccion.getPredeterminada())) {
            quitarPredeterminadas(direccion.getUsuarioId());
        } else {
            direccion.setPredeterminada(false);
        }

        return direccionRepository.save(direccion);
    }

    @Transactional
    public Direccion actualizarDireccion(Long id, Direccion datos) {

        Direccion direccion = buscarDireccion(id);

        if (datos.getUsuarioId() == null ||
                !direccion.getUsuarioId().equals(datos.getUsuarioId())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "No se puede cambiar el usuario de una dirección"
            );
        }

        direccion.setCalle(datos.getCalle());
        direccion.setNumero(datos.getNumero());
        direccion.setDepartamento(datos.getDepartamento());
        direccion.setComuna(datos.getComuna());
        direccion.setCiudad(datos.getCiudad());
        direccion.setRegion(datos.getRegion());
        direccion.setReferencia(datos.getReferencia());

        if (Boolean.TRUE.equals(datos.getPredeterminada())) {
            quitarPredeterminadas(direccion.getUsuarioId());
            direccion.setPredeterminada(true);
        } else if (!Boolean.TRUE.equals(direccion.getPredeterminada())) {
            direccion.setPredeterminada(false);
        }

        return direccionRepository.save(direccion);
    }

    @Transactional
    public Direccion establecerPredeterminada(Long id) {

        Direccion direccion = buscarDireccion(id);

        quitarPredeterminadas(direccion.getUsuarioId());

        direccion.setPredeterminada(true);

        return direccionRepository.save(direccion);
    }

    @Transactional
    public void eliminarDireccion(Long id) {

        Direccion direccion = buscarDireccion(id);

        Long usuarioId = direccion.getUsuarioId();

        boolean eraPredeterminada =
                Boolean.TRUE.equals(direccion.getPredeterminada());

        direccionRepository.delete(direccion);
        direccionRepository.flush();

        if (eraPredeterminada) {

            List<Direccion> restantes =
                    direccionRepository.findByUsuarioId(usuarioId);

            if (!restantes.isEmpty()) {
                Direccion nuevaPrincipal = restantes.get(0);
                nuevaPrincipal.setPredeterminada(true);
                direccionRepository.save(nuevaPrincipal);
            }
        }
    }

    private void quitarPredeterminadas(Long usuarioId) {

        List<Direccion> direcciones =
                direccionRepository.findByUsuarioId(usuarioId);

        for (Direccion direccion : direcciones) {
            if (Boolean.TRUE.equals(direccion.getPredeterminada())) {
                direccion.setPredeterminada(false);
                direccionRepository.save(direccion);
            }
        }
    }
}