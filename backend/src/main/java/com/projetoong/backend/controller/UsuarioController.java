package com.projetoong.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.projetoong.backend.model.AlterarSenhaRequest;
import com.projetoong.backend.model.LoginRequest;
import com.projetoong.backend.model.LoginResponse;
import com.projetoong.backend.model.PerfilUsuarioRequest;
import com.projetoong.backend.model.TipoUsuario;
import com.projetoong.backend.model.Usuario;
import com.projetoong.backend.model.UsuarioResponse;
import com.projetoong.backend.service.JwtService;
import com.projetoong.backend.service.UsuarioService;


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

    public record TipoRequest(TipoUsuario tipoUsuario) {}

    @GetMapping("/usuarios")
    public List<UsuarioResponse> listar() {
        return usuarioService.listar();
    }

    @GetMapping("/usuarios/me")
    public UsuarioResponse atual(@RequestHeader("Authorization") String auth) {
        return UsuarioResponse.de(jwtService.autenticar(auth));
    }

    @PutMapping("/usuarios/me")
    public UsuarioResponse atualizarPerfil(
        @RequestHeader("Authorization") String auth,
        @RequestBody PerfilUsuarioRequest dados
    ) {
        return usuarioService.atualizarPerfil(jwtService.autenticar(auth), dados);
    }

    @PatchMapping("/usuarios/me/senha")
    public void alterarSenha(
        @RequestHeader("Authorization") String auth,
        @RequestBody AlterarSenhaRequest dados
    ) {
        usuarioService.alterarSenha(jwtService.autenticar(auth), dados);
    }

    @PostMapping("/usuarios/me/foto")
    public UsuarioResponse salvarFoto(
        @RequestHeader("Authorization") String auth,
        @RequestParam("imagem") MultipartFile imagem
    ) {
        return usuarioService.salvarFoto(jwtService.autenticar(auth), imagem);
    }

    @DeleteMapping("/usuarios/me/foto")
    public UsuarioResponse removerFoto(@RequestHeader("Authorization") String auth) {
        return usuarioService.removerFoto(jwtService.autenticar(auth));
    }

    @PatchMapping("/usuarios/{id}/tipo")
    public UsuarioResponse tipo(@PathVariable Long id, @RequestBody TipoRequest dados) {
        return usuarioService.alterarTipo(id, dados.tipoUsuario());
    }

    @PostMapping("/usuarios")
    public UsuarioResponse salvarUsuario(@RequestBody Usuario usuario) {
        return UsuarioResponse.de(usuarioService.salvarUsuario(usuario));
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest loginRequest) {
        Usuario usuario = usuarioService.autenticarUsuario(
            loginRequest.email(),
            loginRequest.senha()
        );

        String token = jwtService.gerarToken(usuario);

        return new LoginResponse(token, UsuarioResponse.de(usuario));
    }
}
