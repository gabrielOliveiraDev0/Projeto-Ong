package com.projetoong.backend.model;

public record LoginRequest(
    String email,
    String senha
) {
}