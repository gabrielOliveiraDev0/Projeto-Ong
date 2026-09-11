package com.projetoong.backend.service;

import org.springframework.stereotype.Service;
import com.projetoong.backend.repository.AnimalRepository;
import java.util.List;
import com.projetoong.backend.model.Animal;

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
}