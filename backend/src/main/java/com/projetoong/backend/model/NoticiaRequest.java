package com.projetoong.backend.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record NoticiaRequest(
        @NotBlank @Size(max = 255) String tituloNoticia,
        @NotBlank @Size(max = 20000) String descricaoNoticia) {
}
