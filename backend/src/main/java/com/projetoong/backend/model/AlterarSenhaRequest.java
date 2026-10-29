package com.projetoong.backend.model;

public record AlterarSenhaRequest(
    String senhaAtual,
    String novaSenha
) {
}
