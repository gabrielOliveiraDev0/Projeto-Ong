package com.projetoong.backend.controller;

import org.springframework.web.bind.annotation.RestController;
import com.projetoong.backend.service.AnimalService;

@RestController
public class AnimalController {
    private final AnimalService animalService;

    public AnimalController(AnimalService animalService) {
        this.animalService = animalService;
    }

}