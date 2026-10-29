package com.projetoong.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.projetoong.backend.model.SolicitacaoAdocao;
import com.projetoong.backend.model.StatusSolicitacaoAdocao;

public interface SolicitacaoAdocaoRepository
        extends JpaRepository<SolicitacaoAdocao, Long> {

    @org.springframework.data.jpa.repository.Query("select s.animal.idAnimal from SolicitacaoAdocao s where s.idSolicitacao = :id")
    java.util.Optional<Long> animalId(@org.springframework.data.repository.query.Param("id") Long id);

    List<SolicitacaoAdocao> findByUsuarioIdUsuario(Long idUsuario);

    List<SolicitacaoAdocao> findByStatusSolicitacao(
        StatusSolicitacaoAdocao status
    );
}