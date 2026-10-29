package com.projetoong.backend.model;

public record UsuarioResponse(
    Long idUsuario,
    String nomeUsuario,
    String sobrenomeUsuario,
    String emailUsuario,
    String telefoneUsuario,
    String regiaoUsuario,
    String imagemPerfilUsuario,
    TipoUsuario tipoUsuario
) {
    public static UsuarioResponse de(Usuario u) {
        return new UsuarioResponse(
            u.getIdUsuario(),
            u.getNomeUsuario(),
            u.getSobrenomeUsuario(),
            u.getEmailUsuario(),
            u.getTelefoneUsuario(),
            u.getRegiaoUsuario(),
            u.getImagemPerfilUsuario(),
            u.getTipoUsuario()
        );
    }
}
