package com.projetoong.backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.projetoong.backend.model.LoginRequest;
import com.projetoong.backend.model.LoginResponse;
import com.projetoong.backend.model.Usuario;
import com.projetoong.backend.service.JwtService;
import com.projetoong.backend.service.UsuarioService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final JwtService jwtService;

    public UsuarioController(
        UsuarioService usuarioService,
        JwtService jwtService
    ) {
        this.usuarioService = usuarioService;
        this.jwtService = jwtService;
    }

    @PostMapping("/usuarios")
    public Usuario salvarUsuario(@RequestBody Usuario usuario) {
        return usuarioService.salvarUsuario(usuario);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest loginRequest) {

        Usuario usuario = usuarioService.autenticarUsuario(
            loginRequest.email(),
            loginRequest.senha()
        );

        String token = jwtService.gerarToken(usuario);

        return new LoginResponse(token, usuario);
    }
}