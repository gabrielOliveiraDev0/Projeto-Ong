package com.projetoong.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.projetoong.backend.model.Animal;
import com.projetoong.backend.model.StatusAnimalRequest;
import com.projetoong.backend.service.AnimalService;

import java.io.IOException;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PutMapping;
import com.projetoong.backend.model.StatusAnimalRequest;
import com.projetoong.backend.service.JwtService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class AnimalController {

    private final AnimalService animalService;
    private final JwtService jwtService;

    public AnimalController(
            AnimalService animalService,
            JwtService jwtService) {
        this.animalService = animalService;
        this.jwtService = jwtService;
    }

    @GetMapping("/animais")
    public List<Animal> listarAnimais() {
        return animalService.listarAnimais();
    }

    @PostMapping("/animais")
    public Animal salvarAnimal(
            @RequestBody Animal animal,
            @RequestHeader(value = "Authorization", required = false) String authorization) {

        if (!jwtService.ehAdministrador(authorization)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Apenas administradores podem cadastrar animais");
        }

        return animalService.salvarAnimal(animal);
    }

    @PostMapping("/animais/{id}/imagem")
    public Animal salvarImagem(
            @PathVariable Long id,
            @RequestParam("imagem") MultipartFile imagem) throws IOException {

        return animalService.salvarImagem(id, imagem);
    }

    @GetMapping("/animais/{id}")
    public Animal buscarAnimalPorId(@PathVariable Long id) {
        return animalService.buscarAnimalPorId(id);
    }

    @GetMapping("/animais/disponiveis")
    public List<Animal> listarAnimaisDisponiveis() {
        return animalService.listarAnimaisDisponiveis();
    }

    @PatchMapping("/animais/{id}/status")
    public Animal atualizarStatusAnimal(
            @PathVariable Long id,
            @RequestBody StatusAnimalRequest statusRequest,
            @RequestHeader(value = "Authorization", required = false) String authorization) {

        if (!jwtService.ehAdministrador(authorization)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Apenas administradores podem alterar o status do animal");
        }

        return animalService.atualizarStatusAnimal(
                id,
                statusRequest.statusAnimal());
    }

    @PutMapping("/animais/{id}")
    public Animal atualizarAnimal(
            @PathVariable Long id,
            @RequestBody Animal animal,
            @RequestHeader(value = "Authorization", required = false) String authorization) {

        if (!jwtService.ehAdministrador(authorization)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Apenas administradores podem editar animais");
        }

        return animalService.atualizarAnimal(id, animal);
    }
}