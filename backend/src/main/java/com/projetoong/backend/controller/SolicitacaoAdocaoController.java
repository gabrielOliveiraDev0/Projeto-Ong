package com.projetoong.backend.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.projetoong.backend.model.SolicitacaoAdocao;
import com.projetoong.backend.model.SolicitacaoAdocaoRequest;
import com.projetoong.backend.model.Usuario;
import com.projetoong.backend.service.JwtService;
import com.projetoong.backend.service.SolicitacaoAdocaoService;


@RestController
@RequestMapping("/adocoes")
public class SolicitacaoAdocaoController {

    private final SolicitacaoAdocaoService service;
    private final JwtService jwtService;

    public SolicitacaoAdocaoController(
        SolicitacaoAdocaoService service,
        JwtService jwtService
    ) {
        this.service = service;
        this.jwtService = jwtService;
    }

    @PostMapping
    public SolicitacaoAdocao solicitar(
        @RequestBody SolicitacaoAdocaoRequest dados,
        @RequestHeader("Authorization") String auth
    ) {
        jwtService.exigirProprioUsuario(auth, dados.idUsuario());
        return service.solicitar(dados);
    }

    @PostMapping(value = "/com-holerite", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public SolicitacaoAdocao solicitarComHolerite(
        @RequestPart("dados") SolicitacaoAdocaoRequest dados,
        @RequestPart("holerite") MultipartFile holerite,
        @RequestHeader("Authorization") String auth
    ) {
        jwtService.exigirProprioUsuario(auth, dados.idUsuario());
        return service.solicitarComHolerite(dados, holerite);
    }

    @GetMapping("/usuario/{idUsuario}")
    public List<SolicitacaoAdocao> listarUsuario(
        @PathVariable Long idUsuario,
        @RequestHeader("Authorization") String auth
    ) {
        jwtService.exigirProprioUsuario(auth, idUsuario);
        return service.listarUsuario(idUsuario);
    }

    @GetMapping("/{id}/holerite")
    public ResponseEntity<Resource> holerite(
        @PathVariable Long id,
        @RequestHeader("Authorization") String auth
    ) throws IOException {
        Usuario usuario = jwtService.autenticar(auth);
        Path arquivo = service.buscarHolerite(id, usuario);
        Resource resource = new UrlResource(arquivo.toUri());
        String tipo = Files.probeContentType(arquivo);

        return ResponseEntity.ok()
            .header(HttpHeaders.CACHE_CONTROL, "no-store")
            .header("X-Content-Type-Options", "nosniff")
            .contentType(MediaType.parseMediaType(tipo == null ? "application/octet-stream" : tipo))
            .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"holerite\"")
            .body(resource);
    }

    @GetMapping("/pendentes")
    public List<SolicitacaoAdocao> listarPendentes(
        @RequestHeader(value = "Authorization", required = false) String authorization
    ) {
        if (!jwtService.ehAdministrador(authorization)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        return service.listarPendentes();
    }

    @PatchMapping("/{id}/aprovar")
    public SolicitacaoAdocao aprovar(
        @PathVariable Long id,
        @RequestHeader(value = "Authorization", required = false) String authorization
    ) {
        if (!jwtService.ehAdministrador(authorization)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        return service.aprovar(id);
    }

    @PatchMapping("/{id}/recusar")
    public SolicitacaoAdocao recusar(
        @PathVariable Long id,
        @RequestHeader(value = "Authorization", required = false) String authorization
    ) {
        if (!jwtService.ehAdministrador(authorization)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        return service.recusar(id);
    }
}
