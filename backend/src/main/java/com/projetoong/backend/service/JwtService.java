package com.projetoong.backend.service;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.projetoong.backend.model.Usuario;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private final SecretKey chave;

    public JwtService(@Value("${app.jwt.secret}") String secret) {
        this.chave = Keys.hmacShaKeyFor(
            secret.getBytes(StandardCharsets.UTF_8)
        );
    }

    public String gerarToken(Usuario usuario) {

        return Jwts.builder()
            .subject(usuario.getEmailUsuario())
            .claim("idUsuario", usuario.getIdUsuario())
            .claim("tipoUsuario", usuario.getTipoUsuario().name())
            .issuedAt(new Date())
            .expiration(
                new Date(System.currentTimeMillis() + 86400000)
            )
            .signWith(chave)
            .compact();
    }
}