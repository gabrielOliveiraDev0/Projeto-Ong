package com.projetoong.backend.controller;

import com.projetoong.backend.model.StatusAnimal;
import com.projetoong.backend.service.AnimalService;
import com.projetoong.backend.service.EstoqueService;
import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class IndicadoresController {
    private final AnimalService animais;
    private final EstoqueService estoque;

    public IndicadoresController(AnimalService animais, EstoqueService estoque) {
        this.animais = animais;
        this.estoque = estoque;
    }

    @GetMapping("/indicadores")
    public Map<String, Object> indicadores() {
        var lista = animais.listarAnimais();
        Map<String, Object> resultado = new LinkedHashMap<>();
        resultado.put("adotados", lista.stream().filter(a -> a.getStatusAnimal() == StatusAnimal.ADOTADO).count());
        resultado.put("disponiveis", lista.stream().filter(a -> a.getStatusAnimal() == StatusAnimal.DISPONIVEL).count());
        resultado.put("emTratamento", lista.stream().filter(a -> a.getStatusAnimal() == StatusAnimal.EM_TRATAMENTO).count());
        resultado.put("resgatados", lista.stream().filter(a -> a.getStatusAnimal() == StatusAnimal.RESGATADO).count());
        BigDecimal racaoKg = estoque.quantidadeRacaoKg();
        resultado.put("racaoKg", racaoKg);
        return resultado;
    }
}
