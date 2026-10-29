package com.projetoong.backend.controller;

import com.projetoong.backend.model.RelatorioMensalResponse;
import com.projetoong.backend.service.RelatorioMensalService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/relatorios")
public class RelatorioController {
    private final RelatorioMensalService service;
    public RelatorioController(RelatorioMensalService service) { this.service = service; }

    @GetMapping("/mensal")
    public RelatorioMensalResponse mensal(@RequestParam int mes, @RequestParam int ano) {
        return service.gerar(mes, ano);
    }
}
