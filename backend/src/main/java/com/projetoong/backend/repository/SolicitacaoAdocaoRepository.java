package com.projetoong.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.projetoong.backend.model.SolicitacaoAdocao;
import com.projetoong.backend.model.StatusSolicitacaoAdocao;

public interface SolicitacaoAdocaoRepository
        extends JpaRepository<SolicitacaoAdocao, Long> {

    List<SolicitacaoAdocao> findByUsuarioIdUsuario(Long idUsuario);

    List<SolicitacaoAdocao> findByStatusSolicitacao(
        StatusSolicitacaoAdocao status
    );
}