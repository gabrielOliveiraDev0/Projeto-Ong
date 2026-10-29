package com.projetoong.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.projetoong.backend.model.Favorito;
import com.projetoong.backend.service.FavoritoService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class FavoritoController {

    private final FavoritoService favoritoService;
    private final com.projetoong.backend.service.JwtService jwt;

    public FavoritoController(FavoritoService favoritoService, com.projetoong.backend.service.JwtService jwt) {
        this.jwt = jwt;
        this.favoritoService = favoritoService;
    }

    @PostMapping("/favoritos")
    public Favorito adicionar(
        @RequestParam Long idUsuario,
        @RequestParam Long idAnimal,
        @org.springframework.web.bind.annotation.RequestHeader("Authorization") String auth
    ) {
        jwt.exigirProprioUsuario(auth, idUsuario);
        return favoritoService.adicionar(idUsuario, idAnimal);
    }

    @GetMapping("/favoritos/usuario/{idUsuario}")
    public List<Favorito> listar(
        @PathVariable Long idUsuario,
        @org.springframework.web.bind.annotation.RequestHeader("Authorization") String auth
    ) {
        jwt.exigirProprioUsuario(auth, idUsuario);
        return favoritoService.listar(idUsuario);
    }

    @DeleteMapping("/favoritos")
    public void remover(
        @RequestParam Long idUsuario,
        @RequestParam Long idAnimal,
        @org.springframework.web.bind.annotation.RequestHeader("Authorization") String auth
    ) {
        jwt.exigirProprioUsuario(auth, idUsuario);
        favoritoService.remover(idUsuario, idAnimal);
    }
}