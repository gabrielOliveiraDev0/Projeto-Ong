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
public class AnimalService {

    private final AnimalRepository animalRepository;

    public AnimalService(AnimalRepository animalRepository) {
        this.animalRepository = animalRepository;
    }

    public List<Animal> listarAnimais() {
        return animalRepository.findAll();
    }

    public Animal salvarAnimal(Animal animal) {

        if (animal.getStatusAnimal() == null) {
            animal.setStatusAnimal(StatusAnimal.RESGATADO);
        }

        return animalRepository.save(animal);
    }

    public Animal salvarImagem(Long idAnimal, MultipartFile imagem) throws IOException {

        Animal animal = animalRepository.findById(idAnimal)
                .orElseThrow(() -> new RuntimeException("Animal não encontrado"));

        Path pasta = Paths.get("../uploads/animais");

        Files.createDirectories(pasta);

        String nomeArquivo = UUID.randomUUID() + "_" + imagem.getOriginalFilename();

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
                .orElseThrow(() -> new RuntimeException("Animal não encontrado"));
    }

    public List<Animal> listarAnimaisDisponiveis() {
        return animalRepository.findByStatusAnimal(
                StatusAnimal.DISPONIVEL);
    }

    public Animal atualizarStatusAnimal(
            Long idAnimal,
            StatusAnimal novoStatus) {

        Animal animal = animalRepository.findById(idAnimal)
                .orElseThrow(() -> new RuntimeException("Animal não encontrado"));

        animal.setStatusAnimal(novoStatus);

        return animalRepository.save(animal);
    }

    public Animal atualizarAnimal(Long idAnimal, Animal dadosAtualizados) {

        Animal animal = animalRepository.findById(idAnimal)
                .orElseThrow(() -> new RuntimeException("Animal não encontrado"));

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

        animal.setStatusAnimal(dadosAtualizados.getStatusAnimal());

        return animalRepository.save(animal);
    }
}