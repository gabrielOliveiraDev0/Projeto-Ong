package com.projetoong.backend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.projetoong.backend.model.Animal;
import com.projetoong.backend.model.SolicitacaoAdocao;
import com.projetoong.backend.model.SolicitacaoAdocaoRequest;
import com.projetoong.backend.model.StatusAnimal;
import com.projetoong.backend.model.StatusSolicitacaoAdocao;
import com.projetoong.backend.model.TipoUsuario;
import com.projetoong.backend.model.Usuario;
import com.projetoong.backend.repository.AnimalRepository;
import com.projetoong.backend.repository.SolicitacaoAdocaoRepository;
import com.projetoong.backend.repository.UsuarioRepository;

@Service
@org.springframework.transaction.annotation.Transactional
public class SolicitacaoAdocaoService {

    private final SolicitacaoAdocaoRepository solicitacaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final AnimalRepository animalRepository;
    private final EstoqueService estoque;
    private final MovimentacaoAnimalService movimentacoesAnimais;

    public SolicitacaoAdocaoService(
        SolicitacaoAdocaoRepository solicitacaoRepository,
        UsuarioRepository usuarioRepository,
        AnimalRepository animalRepository,
        EstoqueService estoque,
        MovimentacaoAnimalService movimentacoesAnimais
    ) {
        this.estoque = estoque;
        this.movimentacoesAnimais = movimentacoesAnimais;
        this.solicitacaoRepository = solicitacaoRepository;
        this.usuarioRepository = usuarioRepository;
        this.animalRepository = animalRepository;
    }

    public SolicitacaoAdocao solicitar(SolicitacaoAdocaoRequest dados) {
        return criarSolicitacao(dados, null);
    }

    public SolicitacaoAdocao solicitarComHolerite(SolicitacaoAdocaoRequest dados, MultipartFile holerite) {
        validarHolerite(holerite);
        return criarSolicitacao(dados, holerite);
    }

    private SolicitacaoAdocao criarSolicitacao(SolicitacaoAdocaoRequest dados, MultipartFile holerite) {
        Usuario usuario = usuarioRepository.findById(dados.idUsuario())
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Animal animal = animalRepository.bloquear(dados.idAnimal())
            .orElseThrow(() -> new RuntimeException("Animal não encontrado"));

        if (animal.isRemovido() || animal.getStatusAnimal() != StatusAnimal.DISPONIVEL) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Animal não está disponível");
        }

        if (
            solicitacaoRepository.findByUsuarioIdUsuario(dados.idUsuario()).stream().anyMatch(
                s -> s.getAnimal().getIdAnimal().equals(dados.idAnimal()) &&
                s.getStatusSolicitacao() == StatusSolicitacaoAdocao.PENDENTE
            )
        ) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe uma solicitação pendente para este animal");
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
        solicitacao.setStatusSolicitacao(StatusSolicitacaoAdocao.PENDENTE);

        if (holerite != null) {
            solicitacao.setHoleriteImagem(salvarHoleriteArquivo(holerite));
        }

        return solicitacaoRepository.save(solicitacao);
    }

    public List<SolicitacaoAdocao> listarUsuario(Long idUsuario) {
        return solicitacaoRepository.findByUsuarioIdUsuario(idUsuario);
    }

    public List<SolicitacaoAdocao> listarPendentes() {
        return solicitacaoRepository.findByStatusSolicitacao(StatusSolicitacaoAdocao.PENDENTE);
    }

    public Path buscarHolerite(Long idSolicitacao, Usuario solicitante) {
        SolicitacaoAdocao solicitacao = solicitacaoRepository.findById(idSolicitacao)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitação não encontrada"));

        boolean administrador = solicitante.getTipoUsuario() == TipoUsuario.ADMINISTRADOR;
        boolean proprio = solicitacao.getUsuario().getIdUsuario().equals(solicitante.getIdUsuario());

        if (!administrador && !proprio) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Sem permissão para visualizar este holerite");
        }

        if (solicitacao.getHoleriteImagem() == null || solicitacao.getHoleriteImagem().isBlank()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Holerite não enviado");
        }

        Path arquivo = Paths.get("../uploads/holerites").resolve(solicitacao.getHoleriteImagem()).normalize();

        if (!Files.exists(arquivo)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Arquivo do holerite não encontrado");
        }

        return arquivo;
    }

    public SolicitacaoAdocao aprovar(Long id) {
        estoque.processarAntesAlteracao();

        SolicitacaoAdocao solicitacao = solicitacaoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Solicitação não encontrada"));

        Animal bloqueado = animalRepository.bloquear(solicitacao.getAnimal().getIdAnimal()).orElseThrow();

        if (
            solicitacao.getStatusSolicitacao() != StatusSolicitacaoAdocao.PENDENTE ||
            bloqueado.getStatusAnimal() != StatusAnimal.DISPONIVEL ||
            bloqueado.isRemovido()
        ) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Solicitação ou animal indisponível");
        }

        estoque.encerrar(bloqueado.getIdAnimal());

        for (var outra : solicitacaoRepository.findByStatusSolicitacao(StatusSolicitacaoAdocao.PENDENTE)) {
            if (
                !outra.getIdSolicitacao().equals(id) &&
                outra.getAnimal().getIdAnimal().equals(bloqueado.getIdAnimal())
            ) {
                outra.setStatusSolicitacao(StatusSolicitacaoAdocao.RECUSADA);
                outra.setDataDecisao(java.time.Instant.now());
            }
        }

        solicitacao.setStatusSolicitacao(StatusSolicitacaoAdocao.APROVADA);
        solicitacao.setDataDecisao(java.time.Instant.now());

        Animal animal = solicitacao.getAnimal();
        animal.setStatusAnimal(StatusAnimal.ADOTADO);

        Animal salvo = animalRepository.save(animal);
        movimentacoesAnimais.registrarSaida(salvo, "Adoção aprovada");

        return solicitacaoRepository.save(solicitacao);
    }

    public SolicitacaoAdocao recusar(Long id) {
        estoque.processarAntesAlteracao();

        SolicitacaoAdocao solicitacao = solicitacaoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Solicitação não encontrada"));

        if (solicitacao.getStatusSolicitacao() != StatusSolicitacaoAdocao.PENDENTE) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Solicitação já analisada");
        }

        solicitacao.setStatusSolicitacao(StatusSolicitacaoAdocao.RECUSADA);
        solicitacao.setDataDecisao(java.time.Instant.now());
        return solicitacaoRepository.save(solicitacao);
    }

    private void validarHolerite(MultipartFile holerite) {
        String tipo = holerite == null || holerite.getContentType() == null ? "" : holerite.getContentType();

        if (
            holerite == null ||
            holerite.isEmpty() ||
            holerite.getSize() > 5 * 1024 * 1024 ||
            !Set.of("image/jpeg", "image/png", "image/webp").contains(tipo)
        ) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Envie o holerite em JPG, PNG ou WebP com até 5 MB"
            );
        }
    }

    private String salvarHoleriteArquivo(MultipartFile holerite) {
        validarHolerite(holerite);

        try {
            Path pasta = Paths.get("../uploads/holerites");
            Files.createDirectories(pasta);

            String tipo = holerite.getContentType();
            String extensao = "image/png".equals(tipo) ? ".png" : "image/webp".equals(tipo) ? ".webp" : ".jpg";
            String nome = UUID.randomUUID() + extensao;

            Files.copy(
                holerite.getInputStream(),
                pasta.resolve(nome),
                StandardCopyOption.REPLACE_EXISTING
            );

            return nome;
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Não foi possível salvar o holerite");
        }
    }
}
