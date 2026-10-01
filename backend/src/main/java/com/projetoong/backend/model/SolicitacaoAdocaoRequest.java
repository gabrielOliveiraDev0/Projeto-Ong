package com.projetoong.backend.model;

import java.math.BigDecimal;

public record SolicitacaoAdocaoRequest(
    Long idUsuario,
    Long idAnimal,
    String tipoMoradia,
    Boolean residenciaPermiteAnimais,
    Boolean possuiOutrosAnimais,
    String tempoAnimalSozinho,
    String motivoAdocao,
    String experienciaComAnimais,
    BigDecimal rendaMensal
) {
}