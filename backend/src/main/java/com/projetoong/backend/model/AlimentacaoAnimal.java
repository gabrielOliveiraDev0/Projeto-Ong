package com.projetoong.backend.model;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.*;
@Entity
@Table(name="alimentacoes_animais")
public class AlimentacaoAnimal {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional=false)
    private Animal animal;
    @ManyToOne(optional=false)
    private ItemEstoque racao;
    
    private Instant dataInicio;
    
    private Instant dataFim;
    
    private Instant processadoAte;
    
    private boolean ativa;
    public Long getId() { return id; }
    public void setId(Long value) { id = value; }
    public Animal getAnimal() { return animal; }
    public void setAnimal(Animal value) { animal = value; }
    public ItemEstoque getRacao() { return racao; }
    public void setRacao(ItemEstoque value) { racao = value; }
    public Instant getDataInicio() { return dataInicio; }
    public void setDataInicio(Instant value) { dataInicio = value; }
    public Instant getDataFim() { return dataFim; }
    public void setDataFim(Instant value) { dataFim = value; }
    public Instant getProcessadoAte() { return processadoAte; }
    public void setProcessadoAte(Instant value) { processadoAte = value; }
    public boolean getAtiva() { return ativa; }
    public void setAtiva(boolean value) { ativa = value; }
}
