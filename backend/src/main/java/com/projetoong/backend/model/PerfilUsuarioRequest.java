package com.projetoong.backend.model;

public record PerfilUsuarioRequest(
    String nomeUsuario,
    String sobrenomeUsuario,
    String emailUsuario,
    String telefoneUsuario,
    String regiaoUsuario
) {
}
