package com.projetoong.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.projetoong.backend.model.Animal;
import com.projetoong.backend.model.SolicitacaoAdocao;
import com.projetoong.backend.model.SolicitacaoAdocaoRequest;
import com.projetoong.backend.model.StatusAnimal;
import com.projetoong.backend.model.StatusSolicitacaoAdocao;
import com.projetoong.backend.model.Usuario;
import com.projetoong.backend.repository.AnimalRepository;
import com.projetoong.backend.repository.SolicitacaoAdocaoRepository;
import com.projetoong.backend.repository.UsuarioRepository;

@Service
public class SolicitacaoAdocaoService {

    private final SolicitacaoAdocaoRepository solicitacaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final AnimalRepository animalRepository;

    public SolicitacaoAdocaoService(
        SolicitacaoAdocaoRepository solicitacaoRepository,
        UsuarioRepository usuarioRepository,
        AnimalRepository animalRepository
    ) {
        this.solicitacaoRepository = solicitacaoRepository;
        this.usuarioRepository = usuarioRepository;
        this.animalRepository = animalRepository;
    }

    public SolicitacaoAdocao solicitar(SolicitacaoAdocaoRequest dados) {

        Usuario usuario = usuarioRepository.findById(dados.idUsuario())
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Animal animal = animalRepository.findById(dados.idAnimal())
            .orElseThrow(() -> new RuntimeException("Animal não encontrado"));

        if (animal.getStatusAnimal() != StatusAnimal.DISPONIVEL) {
            throw new RuntimeException("Animal não está disponível");
        }

        SolicitacaoAdocao solicitacao = new SolicitacaoAdocao();

        solicitacao.setUsuario(usuario);
        solicitacao.setAnimal(animal);
        solicitacao.setTipoMoradia(dados.tipoMoradia());
        solicitacao.setResidenciaPermiteAnimais(dados.residenciaPermiteAnimais());
        solicitacao.setPossuiOutrosAnimais(dados.possuiOutrosAnimais());
        solicitacao.setTempoAnimalSozinho(dados.tempoAnimalSozinho());
        solicitacao.setMotivoAdocao(dados.motivoAdocao());
        solicitacao.setExperienciaComAnimais(dados.experienciaComAnimais());
        solicitacao.setRendaMensal(dados.rendaMensal());

        solicitacao.setStatusSolicitacao(
            StatusSolicitacaoAdocao.PENDENTE
        );

        return solicitacaoRepository.save(solicitacao);
    }

    public List<SolicitacaoAdocao> listarUsuario(Long idUsuario) {
        return solicitacaoRepository.findByUsuarioIdUsuario(idUsuario);
    }

    public List<SolicitacaoAdocao> listarPendentes() {
        return solicitacaoRepository.findByStatusSolicitacao(
            StatusSolicitacaoAdocao.PENDENTE
        );
    }

    public SolicitacaoAdocao aprovar(Long id) {

        SolicitacaoAdocao solicitacao = solicitacaoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Solicitação não encontrada"));

        solicitacao.setStatusSolicitacao(
            StatusSolicitacaoAdocao.APROVADA
        );

        Animal animal = solicitacao.getAnimal();
        animal.setStatusAnimal(StatusAnimal.ADOTADO);

        animalRepository.save(animal);

        return solicitacaoRepository.save(solicitacao);
    }

    public SolicitacaoAdocao recusar(Long id) {

        SolicitacaoAdocao solicitacao = solicitacaoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Solicitação não encontrada"));

        solicitacao.setStatusSolicitacao(
            StatusSolicitacaoAdocao.RECUSADA
        );

        return solicitacaoRepository.save(solicitacao);
    }
}