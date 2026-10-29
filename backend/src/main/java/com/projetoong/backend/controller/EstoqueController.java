package com.projetoong.backend.controller;
import com.projetoong.backend.model.*;
import com.projetoong.backend.service.EstoqueService;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.*;
@RestController
@RequestMapping("/estoque")
public class EstoqueController {
    private final EstoqueService service;
    public EstoqueController(EstoqueService s) { service=s; }
    public record Movimento(@NotBlank String tipo, @NotNull @Digits(integer=12, fraction=8) @DecimalMin("0.00000001") BigDecimal quantidade, @Size(max=2000) String observacao) {}
    public record Vinculo(@NotEmpty List<@NotNull Long> animais) {}
    public record ConsumoRacao(@NotNull @Digits(integer=12, fraction=8) @DecimalMin("0.00000001") BigDecimal consumoRecomendado) {}
    @GetMapping public List<Map<String,Object>> listar() { return service.listar(); }
    @PostMapping public ItemEstoque criar(@Valid @RequestBody ItemEstoqueRequest d) { return service.salvar(null,d); }
    @PutMapping("/{id}") public ItemEstoque editar(@PathVariable Long id,@Valid @RequestBody ItemEstoqueRequest d) { return service.salvar(id,d); }
    @DeleteMapping("/{id}") public void excluir(@PathVariable Long id) { service.excluir(id); }
    @PostMapping("/{id}/movimentacoes") public void movimentar(@PathVariable Long id,@Valid @RequestBody Movimento d) { service.movimentar(id,d.tipo(),d.quantidade(),d.observacao()); }
    @GetMapping("/movimentacoes") public List<MovimentacaoEstoque> historico() { return service.historico(); }
    @PostMapping("/{id}/alimentacoes") public void vincular(@PathVariable Long id,@Valid @RequestBody Vinculo d) { service.vincular(id,d.animais()); }
    @DeleteMapping("/alimentacoes/{animalId}") public void encerrar(@PathVariable Long animalId) { service.encerrar(animalId); }
    @GetMapping("/racoes") public List<Map<String,Object>> listarRacoesVeterinario() { return service.listarRacoesVeterinario(); }
    @PatchMapping("/racoes/{id}/consumo") public ItemEstoque atualizarConsumoRacao(@PathVariable Long id, @Valid @RequestBody ConsumoRacao d) { return service.atualizarConsumoRecomendado(id, d.consumoRecomendado()); }
    @GetMapping("/relatorios") public Map<String,Object> relatorio() { return service.relatorio(); }
}
