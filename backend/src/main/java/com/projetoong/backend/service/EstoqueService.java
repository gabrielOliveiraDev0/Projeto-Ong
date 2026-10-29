package com.projetoong.backend.service;
import com.projetoong.backend.model.*;
import com.projetoong.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.math.*;
import java.time.*;
import java.util.*;
@Service
@Transactional
public class EstoqueService {
    private final ItemEstoqueRepository itens;
    private final MovimentacaoEstoqueRepository movimentos;
    private final AlimentacaoAnimalRepository alimentacoes;
    private final AnimalRepository animais;
    public EstoqueService(ItemEstoqueRepository i, MovimentacaoEstoqueRepository m, AlimentacaoAnimalRepository a, AnimalRepository animais) {
        itens=i; movimentos=m; alimentacoes=a; this.animais=animais;
    }
    private ResponseStatusException erro(String s) { return new ResponseStatusException(HttpStatus.BAD_REQUEST,s); }
    private BigDecimal gramas(ItemEstoque i) { return "KG".equals(i.getUnidade()) ? new BigDecimal("1000") : BigDecimal.ONE; }
    private boolean consome(Animal a) { return !a.isRemovido() && (a.getStatusAnimal()==StatusAnimal.RESGATADO || a.getStatusAnimal()==StatusAnimal.EM_TRATAMENTO || a.getStatusAnimal()==StatusAnimal.DISPONIVEL); }
    private BigDecimal diario(AlimentacaoAnimal a) {
        Double peso=a.getAnimal().getPesoAnimal();
        return consome(a.getAnimal()) && peso!=null && peso>0 ? BigDecimal.valueOf(peso).multiply(a.getRacao().getConsumoRecomendado()) : BigDecimal.ZERO;
    }
    private void registrar(ItemEstoque i, String tipo, BigDecimal q, String obs) {
        MovimentacaoEstoque m=new MovimentacaoEstoque(); m.setItem(i); m.setTipo(tipo); m.setQuantidade(q);
        m.setValorUnitario(i.getValorUnitario()); m.setData(Instant.now()); m.setObservacao(obs); movimentos.save(m);
    }
    public void processar() { processarBloqueados(itens.bloquearTodos(), false); }
    public void processarAntesAlteracao() { processarBloqueados(itens.bloquearTodos(), true); }
    private void processarBloqueados(List<ItemEstoque> todos, boolean fracionado) {
        Instant agora=Instant.now();
        var vinculos=alimentacoes.findByAtivaTrue();
        for (ItemEstoque i:todos) {
            if (i.getCategoria()!=CategoriaEstoque.RACAO || i.getExcluido()) continue;
            BigDecimal total=BigDecimal.ZERO;
            for (AlimentacaoAnimal a:vinculos) {
                if (!a.getRacao().getId().equals(i.getId())) continue;
                Instant limite = fracionado ? agora : a.getProcessadoAte().plus(Duration.ofDays(Math.max(0, Duration.between(a.getProcessadoAte(),agora).toDays())));
                BigDecimal segundos=BigDecimal.valueOf(Math.max(0, Duration.between(a.getProcessadoAte(),limite).toNanos()),9);
                total=total.add(diario(a).multiply(segundos).divide(new BigDecimal("86400"),12,RoundingMode.HALF_UP));
                a.setProcessadoAte(limite);
            }
            BigDecimal pedido=total.divide(gramas(i),8,RoundingMode.HALF_UP);
            if (pedido.signum()>0) {
                BigDecimal baixa=pedido.min(i.getQuantidade());
                registrar(i,"SAIDA_AUTOMATICA",baixa,pedido.compareTo(baixa)>0 ? "Estoque esgotado. Consumo não atendido: "+pedido.subtract(baixa)+" "+i.getUnidade() : "Consumo proporcional ao período decorrido");
                i.setQuantidade(i.getQuantidade().subtract(baixa));
            }
            i.setDataUltimaBaixa(agora);
        }
    }
    private ItemEstoque buscar(Long id) { return itens.findById(id).filter(i->!i.getExcluido()).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Item não encontrado")); }
    public ItemEstoque salvar(Long id, ItemEstoqueRequest d) {
        processarAntesAlteracao();
        ItemEstoque i=id==null ? new ItemEstoque() : buscar(id);
        String unidade=d.unidade().trim().toUpperCase(Locale.ROOT);
        if (d.categoria()==CategoriaEstoque.RACAO && (!Set.of("KG","G").contains(unidade) || d.consumoRecomendado()==null)) throw erro("Ração exige unidade KG ou G e consumo recomendado");
        if (id!=null && (i.getCategoria()!=d.categoria() || !i.getUnidade().equals(unidade))) throw erro("Categoria e unidade não podem mudar após o cadastro");
        i.setNome(d.nome()); i.setCategoria(d.categoria()); i.setUnidade(unidade); i.setValorUnitario(d.valorUnitario());
        i.setFornecedor(d.fornecedor()); i.setDataEntrada(d.dataEntrada()==null?LocalDate.now():d.dataEntrada());
        i.setValidade(d.validade()); i.setEstoqueMinimo(d.estoqueMinimo()); i.setMarca(d.marca()); i.setEspecieIndicada(d.especieIndicada()); i.setConsumoRecomendado(d.consumoRecomendado());
        if(id==null) { i.setQuantidade(d.quantidade()); i.setDataUltimaBaixa(Instant.now()); }
        itens.save(i);
        if(id==null && i.getQuantidade().signum()>0) registrar(i,"ENTRADA",i.getQuantidade(),"Estoque inicial");
        return i;
    }
    public void movimentar(Long id, String tipo, BigDecimal q, String obs) {
        processarAntesAlteracao(); ItemEstoque i=buscar(id);
        if(q==null || q.signum()<=0 || !Set.of("ENTRADA","SAIDA").contains(tipo)) throw erro("Movimentação inválida");
        if(tipo.equals("SAIDA") && q.compareTo(i.getQuantidade())>0) throw erro("Estoque insuficiente");
        i.setQuantidade(tipo.equals("ENTRADA")?i.getQuantidade().add(q):i.getQuantidade().subtract(q));
        registrar(i,tipo,q,obs);
    }
    public void excluir(Long id) {
        processarAntesAlteracao(); ItemEstoque i=buscar(id);
        if(alimentacoes.findByAtivaTrue().stream().anyMatch(a->a.getRacao().getId().equals(id))) throw erro("Troque ou encerre as alimentações antes de excluir a ração");
        if(i.getQuantidade().signum()>0) registrar(i,"SAIDA",i.getQuantidade(),"Baixa por exclusão do item");
        i.setQuantidade(BigDecimal.ZERO); i.setExcluido(true);
    }
    public void vincular(Long id, List<Long> ids) {
        processarAntesAlteracao(); ItemEstoque i=buscar(id);
        if(i.getCategoria()!=CategoriaEstoque.RACAO || ids==null || ids.isEmpty()) throw erro("Selecione uma ração e animais");
        for(Long animalId:new TreeSet<>(ids)) {
            Animal animal=animais.bloquear(animalId).orElseThrow(()->erro("Animal não encontrado"));
            if(!consome(animal) || animal.getPesoAnimal()==null || animal.getPesoAnimal()<=0) throw erro("Animal deve estar na ONG e ter peso positivo");
            if(i.getEspecieIndicada()!=null && !i.getEspecieIndicada().isBlank() && !i.getEspecieIndicada().equalsIgnoreCase(animal.getTipoAnimal())) throw erro("Espécie incompatível com a ração");
            encerrar(animalId);
            alimentacoes.flush();
            AlimentacaoAnimal a=new AlimentacaoAnimal(); a.setAnimal(animal); a.setRacao(i); a.setAtiva(true);
            Instant agora=Instant.now(); a.setDataInicio(agora); a.setProcessadoAte(agora); alimentacoes.save(a);
        }
    }
    public void encerrar(Long animalId) {
        processarAntesAlteracao();
        for(var a:alimentacoes.findByAtivaTrue()) if(a.getAnimal().getIdAnimal().equals(animalId)) { a.setAtiva(false); a.setDataFim(Instant.now()); }
    }
    public List<Map<String,Object>> listar() {
        processar(); var vinculos=alimentacoes.findByAtivaTrue();
        return itens.findAll().stream().filter(i->!i.getExcluido()).map(i->{
            Map<String,Object> r=new LinkedHashMap<>(); r.put("item",i); r.put("valorTotal",i.getQuantidade().multiply(i.getValorUnitario()));
            r.put("estoqueBaixo",i.getQuantidade().compareTo(i.getEstoqueMinimo())<=0); r.put("esgotado",i.getQuantidade().signum()==0);
            var associados=vinculos.stream().filter(a->a.getRacao().getId().equals(i.getId()) && consome(a.getAnimal())).toList();
            BigDecimal consumo=associados.stream().map(this::diario).reduce(BigDecimal.ZERO,BigDecimal::add);
            r.put("animais",associados.stream().map(a->Map.of("idAnimal",a.getAnimal().getIdAnimal(),"nomeAnimal",a.getAnimal().getNomeAnimal(),"pesoAnimal",a.getAnimal().getPesoAnimal(),"consumoDiario",diario(a))).toList());
            r.put("consumoDiario",consumo); r.put("quantidadeAnimais",associados.size());
            BigDecimal dias=consumo.signum()>0?i.getQuantidade().multiply(gramas(i)).divide(consumo,2,RoundingMode.DOWN):null;
            r.put("autonomiaDias",dias); r.put("previsaoFim",dias==null?null:LocalDate.now().plusDays(Math.min(dias.longValue(),3650000)));
            return r;
        }).toList();
    }
    public BigDecimal quantidadeRacaoKg() {
        return itens.findAll().stream()
                .filter(i -> !i.getExcluido() && i.getCategoria() == CategoriaEstoque.RACAO)
                .map(i -> i.getQuantidade().multiply(gramas(i)).divide(new BigDecimal("1000")))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public List<Map<String,Object>> listarRacoesVeterinario() {
        processar();
        return itens.findAll().stream()
                .filter(i -> !i.getExcluido() && i.getCategoria() == CategoriaEstoque.RACAO)
                .map(i -> {
                    Map<String,Object> r = new LinkedHashMap<>();
                    r.put("id", i.getId());
                    r.put("nome", i.getNome());
                    r.put("marca", i.getMarca());
                    r.put("especieIndicada", i.getEspecieIndicada());
                    r.put("consumoRecomendado", i.getConsumoRecomendado());
                    r.put("unidade", i.getUnidade());
                    return r;
                }).toList();
    }

    public ItemEstoque atualizarConsumoRecomendado(Long id, BigDecimal consumoRecomendado) {
        if (consumoRecomendado == null || consumoRecomendado.signum() <= 0) {
            throw erro("Informe um consumo recomendado maior que zero");
        }

        processarAntesAlteracao();
        ItemEstoque i = buscar(id);

        if (i.getCategoria() != CategoriaEstoque.RACAO) {
            throw erro("O item selecionado não é uma ração");
        }

        i.setConsumoRecomendado(consumoRecomendado);
        return itens.save(i);
    }

    public List<MovimentacaoEstoque> historico() { processar(); return movimentos.findAllByOrderByDataDesc(); }
    public Map<String,Object> relatorio() {
        var lista=listar(); Map<String,BigDecimal> categorias=new LinkedHashMap<>();
        for(var c:CategoriaEstoque.values()) categorias.put(c.name(),BigDecimal.ZERO);
        BigDecimal racao=BigDecimal.ZERO, consumo=BigDecimal.ZERO;
        for(var r:lista) {
            ItemEstoque i=(ItemEstoque)r.get("item"); categorias.merge(i.getCategoria().name(),(BigDecimal)r.get("valorTotal"),BigDecimal::add);
            if(i.getCategoria()==CategoriaEstoque.RACAO) { racao=racao.add(i.getQuantidade().multiply(gramas(i)).divide(new BigDecimal("1000"))); consumo=consumo.add((BigDecimal)r.get("consumoDiario")); }
        }
        var historico=movimentos.findAllByOrderByDataDesc();
        BigDecimal entradas=BigDecimal.ZERO,saidas=BigDecimal.ZERO;
        for(var m:historico) { BigDecimal v=m.getQuantidade().multiply(m.getValorUnitario()); if(m.getTipo().equals("ENTRADA")) entradas=entradas.add(v); else saidas=saidas.add(v); }
        return Map.of("porCategoria",categorias,"valorTotal",categorias.values().stream().reduce(BigDecimal.ZERO,BigDecimal::add),"racaoKg",racao,"consumoKgDia",consumo.divide(new BigDecimal("1000")),"entradasValor",entradas,"saidasValor",saidas,"itens",lista);
    }
}
