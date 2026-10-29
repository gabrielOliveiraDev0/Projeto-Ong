package com.projetoong.backend.controller;

import com.projetoong.backend.model.Noticia;
import com.projetoong.backend.model.NoticiaRequest;
import com.projetoong.backend.service.NoticiaService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/noticias")
public class NoticiaController {
    private final NoticiaService service;

    public NoticiaController(NoticiaService service) {
        this.service = service;
    }

    @GetMapping
    public List<Noticia> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public Noticia buscar(@PathVariable Long id) {
        return service.buscar(id);
    }

    @PostMapping
    public Noticia criar(@Valid @RequestBody NoticiaRequest dados) {
        return service.salvar(null, dados);
    }

    @PutMapping("/{id}")
    public Noticia editar(@PathVariable Long id, @Valid @RequestBody NoticiaRequest dados) {
        return service.salvar(id, dados);
    }

    @PostMapping("/{id}/imagem")
    public Noticia salvarImagem(@PathVariable Long id, @RequestParam("imagem") MultipartFile imagem) throws IOException {
        return service.salvarImagem(id, imagem);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) throws IOException {
        service.excluir(id);
    }
}
