package com.projetoong.backend.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.projetoong.backend.model.Usuario;
import com.projetoong.backend.service.UsuarioService;

@RestController
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/usuarios")
    public Usuario salvarUsuario(@RequestBody Usuario usuario) {
        return usuarioService.salvarUsuario(usuario);
    }
}