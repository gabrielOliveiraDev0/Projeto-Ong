package com.projetoong.backend.service;
import org.springframework.stereotype.Component;
import org.springframework.scheduling.annotation.*;
@Component
@EnableScheduling
public class ConsumoAgendado {
    private final EstoqueService estoque;
    public ConsumoAgendado(EstoqueService e) { estoque=e; }
    @Scheduled(fixedDelay=60000, initialDelay=60000)
    public void processar() { estoque.processar(); }
}
