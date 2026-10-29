package com.projetoong.backend.model;

public record LoginResponse(
    String token,
    UsuarioResponse usuario
) {
}