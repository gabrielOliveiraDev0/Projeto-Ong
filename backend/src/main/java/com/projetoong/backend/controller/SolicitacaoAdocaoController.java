package com.projetoong.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.projetoong.backend.model.SolicitacaoAdocao;
import com.projetoong.backend.model.SolicitacaoAdocaoRequest;
import com.projetoong.backend.service.JwtService;
import com.projetoong.backend.service.SolicitacaoAdocaoService;

@CrossOrigin(origins = "http://localhost:5173")
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
        @RequestBody SolicitacaoAdocaoRequest dados
    ) {
        return service.solicitar(dados);
    }

    @GetMapping("/usuario/{idUsuario}")
    public List<SolicitacaoAdocao> listarUsuario(
        @PathVariable Long idUsuario
    ) {
        return service.listarUsuario(idUsuario);
    }

    @GetMapping("/pendentes")
    public List<SolicitacaoAdocao> listarPendentes(
        @RequestHeader(value = "Authorization", required = false)
        String authorization
    ) {

        if (!jwtService.ehAdministrador(authorization)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        return service.listarPendentes();
    }

    @PatchMapping("/{id}/aprovar")
    public SolicitacaoAdocao aprovar(
        @PathVariable Long id,
        @RequestHeader(value = "Authorization", required = false)
        String authorization
    ) {

        if (!jwtService.ehAdministrador(authorization)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        return service.aprovar(id);
    }

    @PatchMapping("/{id}/recusar")
    public SolicitacaoAdocao recusar(
        @PathVariable Long id,
        @RequestHeader(value = "Authorization", required = false)
        String authorization
    ) {

        if (!jwtService.ehAdministrador(authorization)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        return service.recusar(id);
    }
}