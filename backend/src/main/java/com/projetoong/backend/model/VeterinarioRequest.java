package com.projetoong.backend.model;

import jakarta.validation.constraints.Size;

public record VeterinarioRequest(
        @Size(max = 255) String estadoSaudeAnimal,
        Boolean castracaoAnimal,
        @Size(max = 4000) String tratamentoAnimal,
        @Size(max = 4000) String vacinacaoAnimal,
        StatusAnimal statusAnimal) {
}
