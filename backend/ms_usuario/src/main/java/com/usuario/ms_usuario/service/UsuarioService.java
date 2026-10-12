package com.usuario.ms_usuario.service;

import com.usuario.ms_usuario.model.Usuario;
import com.usuario.ms_usuario.repository.UsuarioRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    public Usuario buscarUsuario(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuario no encontrado con ID: " + id
                ));
    }

    public Usuario crearUsuario(Usuario usuario) {

        if (usuarioRepository.existsByCorreo(usuario.getCorreo())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "El correo ya está registrado"
            );
        }

        usuario.setId(null);

        usuario.setRol("CLIENTE");

        return usuarioRepository.save(usuario);
    }

    public Usuario actualizarUsuario(Long id, Usuario datos) {

        Usuario usuario = buscarUsuario(id);

        usuarioRepository.findByCorreo(datos.getCorreo())
                .filter(otro -> !otro.getId().equals(id))
                .ifPresent(otro -> {
                    throw new ResponseStatusException(
                            HttpStatus.CONFLICT,
                            "El correo ya está registrado"
                    );
                });

        usuario.setNombre(datos.getNombre());
        usuario.setApellido(datos.getApellido());
        usuario.setCorreo(datos.getCorreo());
        usuario.setTelefono(datos.getTelefono());


        return usuarioRepository.save(usuario);
    }

    public void eliminarUsuario(Long id) {

        Usuario usuario = buscarUsuario(id);

        usuarioRepository.delete(usuario);
    }
}