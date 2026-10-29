package com.projetoong.backend.model;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.*;
@Entity
@Table(name="itens_estoque")
public class ItemEstoque {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    
    private String nome;
    @Enumerated(EnumType.STRING)
    private CategoriaEstoque categoria;
    @Column(precision=24, scale=8)
    private BigDecimal quantidade = BigDecimal.ZERO;
    
    private String unidade;
    @Column(precision=24, scale=8)
    private BigDecimal valorUnitario;
    
    private String fornecedor;
    
    private LocalDate dataEntrada;
    
    private LocalDate validade;
    @Column(precision=24, scale=8)
    private BigDecimal estoqueMinimo;
    
    private String marca;
    
    private String especieIndicada;
    @Column(precision=24, scale=8)
    private BigDecimal consumoRecomendado;
    
    private Instant dataUltimaBaixa;
    
    private boolean excluido = false;
    public Long getId() { return id; }
    public void setId(Long value) { id = value; }
    public String getNome() { return nome; }
    public void setNome(String value) { nome = value; }
    public CategoriaEstoque getCategoria() { return categoria; }
    public void setCategoria(CategoriaEstoque value) { categoria = value; }
    public BigDecimal getQuantidade() { return quantidade; }
    public void setQuantidade(BigDecimal value) { quantidade = value; }
    public String getUnidade() { return unidade; }
    public void setUnidade(String value) { unidade = value; }
    public BigDecimal getValorUnitario() { return valorUnitario; }
    public void setValorUnitario(BigDecimal value) { valorUnitario = value; }
    public String getFornecedor() { return fornecedor; }
    public void setFornecedor(String value) { fornecedor = value; }
    public LocalDate getDataEntrada() { return dataEntrada; }
    public void setDataEntrada(LocalDate value) { dataEntrada = value; }
    public LocalDate getValidade() { return validade; }
    public void setValidade(LocalDate value) { validade = value; }
    public BigDecimal getEstoqueMinimo() { return estoqueMinimo; }
    public void setEstoqueMinimo(BigDecimal value) { estoqueMinimo = value; }
    public String getMarca() { return marca; }
    public void setMarca(String value) { marca = value; }
    public String getEspecieIndicada() { return especieIndicada; }
    public void setEspecieIndicada(String value) { especieIndicada = value; }
    public BigDecimal getConsumoRecomendado() { return consumoRecomendado; }
    public void setConsumoRecomendado(BigDecimal value) { consumoRecomendado = value; }
    public Instant getDataUltimaBaixa() { return dataUltimaBaixa; }
    public void setDataUltimaBaixa(Instant value) { dataUltimaBaixa = value; }
    public boolean getExcluido() { return excluido; }
    public void setExcluido(boolean value) { excluido = value; }
}
