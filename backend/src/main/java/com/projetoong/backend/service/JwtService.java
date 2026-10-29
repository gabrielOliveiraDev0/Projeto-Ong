package com.projetoong.backend.service;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.projetoong.backend.model.Usuario;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;

@Service
public class JwtService {

    private final SecretKey chave;
    private final com.projetoong.backend.repository.UsuarioRepository usuarios;

    public JwtService(@Value("${app.jwt.secret}") String secret, com.projetoong.backend.repository.UsuarioRepository usuarios) {
        this.usuarios = usuarios;
        this.chave = secret.isBlank() ? Jwts.SIG.HS256.key().build() : Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String gerarToken(Usuario usuario) {

        return Jwts.builder()
                .subject(usuario.getEmailUsuario())
                .claim("idUsuario", usuario.getIdUsuario())
                .claim("tipoUsuario", usuario.getTipoUsuario().name())
                .issuedAt(new Date())
                .expiration(
                        new Date(System.currentTimeMillis() + 86400000))
                .signWith(chave)
                .compact();
    }

    public Usuario autenticar(String authorization) {
        try {
            if (authorization == null || !authorization.startsWith("Bearer ")) throw new IllegalArgumentException();
            Claims claims = Jwts.parser().verifyWith(chave).build().parseSignedClaims(authorization.substring(7)).getPayload();
            return usuarios.findById(((Number) claims.get("idUsuario")).longValue())
                .orElseThrow(() -> new IllegalArgumentException());
        } catch (JwtException | IllegalArgumentException e) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED, "Sessão inválida ou expirada");
        }
    }
    public boolean ehAdministrador(String authorization) {
        return autenticar(authorization).getTipoUsuario() == com.projetoong.backend.model.TipoUsuario.ADMINISTRADOR;
    }
    public void exigirProprioUsuario(String authorization, Long id) {
        Usuario u = autenticar(authorization);
        if (!u.getIdUsuario().equals(id) || u.getTipoUsuario() != com.projetoong.backend.model.TipoUsuario.USUARIO)
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN);
    }
}
