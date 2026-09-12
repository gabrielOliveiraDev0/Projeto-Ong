package com.projetoong.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.projetoong.backend.model.Animal;
import com.projetoong.backend.service.AnimalService;

import java.io.IOException;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "http://localhost:5173")
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

    @PostMapping("/animais/{id}/imagem")
    public Animal salvarImagem(
            @PathVariable Long id,
            @RequestParam("imagem") MultipartFile imagem) throws IOException {

        return animalService.salvarImagem(id, imagem);
    }
}