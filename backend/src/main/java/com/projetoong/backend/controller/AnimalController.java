package com.projetoong.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.projetoong.backend.model.Animal;
import com.projetoong.backend.service.AnimalService;

@RestController
public class AnimalController {

    private final AnimalService animalService;

    public AnimalController(AnimalService animalService) {
        this.animalService = animalService;
    }

    @GetMapping("/animais")
    public List<Animal> listarAnimais() {
        return animalService.listarAnimais();
    }

    @PostMapping("/animais")
    public Animal salvarAnimal(@RequestBody Animal animal) {
        return animalService.salvarAnimal(animal);
    }
}