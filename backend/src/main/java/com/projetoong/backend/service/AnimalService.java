package com.projetoong.backend.service;

import org.springframework.stereotype.Service;
import com.projetoong.backend.repository.AnimalRepository;
import java.util.List;
import com.projetoong.backend.model.Animal;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import com.projetoong.backend.model.StatusAnimal;
import org.springframework.web.multipart.MultipartFile;

@Service
@org.springframework.transaction.annotation.Transactional
public class AnimalService {
    @org.springframework.beans.factory.annotation.Autowired
    private UploadService uploads;

    @jakarta.persistence.PersistenceContext
    private jakarta.persistence.EntityManager entityManager;

    private final AnimalRepository animalRepository;
    private final EstoqueService estoque;
    private final MovimentacaoAnimalService movimentacoesAnimais;

    public AnimalService(AnimalRepository animalRepository, EstoqueService estoque, MovimentacaoAnimalService movimentacoesAnimais) {
        this.estoque = estoque;
        this.animalRepository = animalRepository;
        this.movimentacoesAnimais = movimentacoesAnimais;
    }

    public List<Animal> listarAnimais() {
        return animalRepository.findAll().stream().filter(a -> !a.isRemovido()).toList();
    }

    public void remover(Long id) {
        estoque.encerrar(id);
        Animal a = bloquearAnimal(id);
        movimentacoesAnimais.registrarSaida(a, "Remoção administrativa");
        a.setRemovido(true);
        animalRepository.save(a);
    }
    public Animal veterinario(Long id, com.projetoong.backend.model.VeterinarioRequest d) {
        Animal a = bloquearAnimal(id);

        if (d.statusAnimal() != null && d.statusAnimal() != a.getStatusAnimal()) {
            if (d.statusAnimal() == StatusAnimal.ADOTADO) {
                throw new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.FORBIDDEN,
                        "Veterinário não pode marcar animal como adotado");
            }

            boolean transicaoValida =
                    a.getStatusAnimal() == StatusAnimal.RESGATADO && d.statusAnimal() == StatusAnimal.EM_TRATAMENTO
                    || a.getStatusAnimal() == StatusAnimal.EM_TRATAMENTO && d.statusAnimal() == StatusAnimal.DISPONIVEL;

            if (!transicaoValida) {
                throw new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.BAD_REQUEST,
                        "Transição de status inválida");
            }

            estoque.processarAntesAlteracao();
            a.setStatusAnimal(d.statusAnimal());
        }

        a.setEstadoSaudeAnimal(d.estadoSaudeAnimal());
        a.setCastracaoAnimal(d.castracaoAnimal());
        a.setTratamentoAnimal(d.tratamentoAnimal());
        a.setVacinacaoAnimal(d.vacinacaoAnimal());

        return animalRepository.save(a);
    }
    private Animal bloquearAnimal(Long id) {
        estoque.processarAntesAlteracao();
        Animal animal = animalRepository.bloquear(id).orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Animal não encontrado"));
        entityManager.refresh(animal, jakarta.persistence.LockModeType.PESSIMISTIC_WRITE);
        return animal;
    }

    private void validar(Animal a) {
        if(a.getNomeAnimal()==null || a.getNomeAnimal().isBlank() || a.getPesoAnimal()==null || !Double.isFinite(a.getPesoAnimal()) || a.getPesoAnimal()<=0)
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST,"Informe nome e peso positivo");
    }
    public Animal salvarAnimal(Animal animal) {
        validar(animal);
        animal.setRemovido(false);

        if (animal.getStatusAnimal() == null) {
            animal.setStatusAnimal(StatusAnimal.RESGATADO);
        }

        Animal salvo = animalRepository.save(animal);
        movimentacoesAnimais.registrarEntrada(salvo);
        return salvo;
    }

    public Animal salvarImagem(Long idAnimal, MultipartFile imagem) throws IOException {
        uploads.validar(imagem);

        Animal animal = bloquearAnimal(idAnimal);

        Path pasta = uploads.pasta("animais");

        Files.createDirectories(pasta);

        if (imagem.isEmpty() || imagem.getSize() > 5 * 1024 * 1024 || !java.util.Set.of("image/jpeg", "image/png", "image/webp").contains(imagem.getContentType() == null ? "" : imagem.getContentType()))
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "Envie JPG, PNG ou WebP até 5 MB");
        String nomeArquivo = UUID.randomUUID() + ("image/png".equals(imagem.getContentType()) ? ".png" : "image/webp".equals(imagem.getContentType()) ? ".webp" : ".jpg");

        Path caminhoArquivo = pasta.resolve(nomeArquivo);

        Files.copy(
                imagem.getInputStream(),
                caminhoArquivo,
                StandardCopyOption.REPLACE_EXISTING);

        animal.setImagemAnimal(nomeArquivo);

        return animalRepository.save(animal);
    }

    public Animal buscarAnimalPorId(Long idAnimal) {
        return animalRepository.findById(idAnimal)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND,"Animal não encontrado"));
    }

    public List<Animal> listarAnimaisDisponiveis() {
        return animalRepository.findByStatusAnimal(
                StatusAnimal.DISPONIVEL).stream().filter(a -> !a.isRemovido()).toList();
    }

    public Animal atualizarStatusAnimal(
            Long idAnimal,
            StatusAnimal novoStatus) {
        if(novoStatus == null) throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST);
        estoque.processarAntesAlteracao();
        if(novoStatus == StatusAnimal.ADOTADO) estoque.encerrar(idAnimal);

        Animal animal = bloquearAnimal(idAnimal);

        animal.setStatusAnimal(novoStatus);
        Animal salvo = animalRepository.save(animal);

        if (novoStatus == StatusAnimal.ADOTADO) {
            movimentacoesAnimais.registrarSaida(salvo, "Adoção");
        }

        return salvo;
    }

    public Animal atualizarAnimal(Long idAnimal, Animal dadosAtualizados) {
        validar(dadosAtualizados);
        estoque.processarAntesAlteracao();
        if(dadosAtualizados.getStatusAnimal()==StatusAnimal.ADOTADO) estoque.encerrar(idAnimal);

        Animal animal = bloquearAnimal(idAnimal);

        animal.setTratamentoAnimal(dadosAtualizados.getTratamentoAnimal());
        animal.setVacinacaoAnimal(dadosAtualizados.getVacinacaoAnimal());
        animal.setNomeAnimal(dadosAtualizados.getNomeAnimal());
        animal.setTipoAnimal(dadosAtualizados.getTipoAnimal());
        animal.setSexoAnimal(dadosAtualizados.getSexoAnimal());
        animal.setIdadeAnimal(dadosAtualizados.getIdadeAnimal());
        animal.setRegiaoAnimal(dadosAtualizados.getRegiaoAnimal());
        animal.setPesoAnimal(dadosAtualizados.getPesoAnimal());
        animal.setEstadoSaudeAnimal(dadosAtualizados.getEstadoSaudeAnimal());
        animal.setCastracaoAnimal(dadosAtualizados.getCastracaoAnimal());
        animal.setDescricaoAnimal(dadosAtualizados.getDescricaoAnimal());
        animal.setTelefoneAnimal(dadosAtualizados.getTelefoneAnimal());
        animal.setPessoaParaContatoAnimal(
                dadosAtualizados.getPessoaParaContatoAnimal());

        if(dadosAtualizados.getStatusAnimal()!=null) animal.setStatusAnimal(dadosAtualizados.getStatusAnimal());

        Animal salvo = animalRepository.save(animal);
        if (salvo.getStatusAnimal() == StatusAnimal.ADOTADO) {
            movimentacoesAnimais.registrarSaida(salvo, "Adoção");
        }

        return salvo;
    }
}