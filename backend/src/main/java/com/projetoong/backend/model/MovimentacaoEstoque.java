package com.projetoong.backend.model;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.*;
@Entity
@Table(name="movimentacoes_estoque")
public class MovimentacaoEstoque {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional=false)
    private ItemEstoque item;
    
    private String tipo;
    @Column(precision=24, scale=8)
    private BigDecimal quantidade;
    @Column(precision=24, scale=8)
    private BigDecimal valorUnitario;
    
    private Instant data;
    @Column(length=2000)
    private String observacao;
    public Long getId() { return id; }
    public void setId(Long value) { id = value; }
    public ItemEstoque getItem() { return item; }
    public void setItem(ItemEstoque value) { item = value; }
    public String getTipo() { return tipo; }
    public void setTipo(String value) { tipo = value; }
    public BigDecimal getQuantidade() { return quantidade; }
    public void setQuantidade(BigDecimal value) { quantidade = value; }
    public BigDecimal getValorUnitario() { return valorUnitario; }
    public void setValorUnitario(BigDecimal value) { valorUnitario = value; }
    public Instant getData() { return data; }
    public void setData(Instant value) { data = value; }
    public String getObservacao() { return observacao; }
    public void setObservacao(String value) { observacao = value; }
}
