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
        return animalRepository.save(animal);
    }

    public Animal salvarImagem(Long idAnimal, MultipartFile imagem) throws IOException {

    Animal animal = animalRepository.findById(idAnimal)
            .orElseThrow(() -> new RuntimeException("Animal não encontrado"));

    Path pasta = Paths.get("../uploads/animais");

    Files.createDirectories(pasta);

    String nomeArquivo =
            UUID.randomUUID() + "_" + imagem.getOriginalFilename();

    Path caminhoArquivo = pasta.resolve(nomeArquivo);

    Files.copy(
            imagem.getInputStream(),
            caminhoArquivo,
            StandardCopyOption.REPLACE_EXISTING
    );

    animal.setImagemAnimal(nomeArquivo);

    return animalRepository.save(animal);
}
}