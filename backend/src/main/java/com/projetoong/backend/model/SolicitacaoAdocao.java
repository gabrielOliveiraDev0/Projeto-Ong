package com.projetoong.backend.model;

import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "solicitacoes_adocao")
public class SolicitacaoAdocao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idSolicitacao;

    @ManyToOne
    private Usuario usuario;

    @ManyToOne
    private Animal animal;

    @Enumerated(EnumType.STRING)
    private StatusSolicitacaoAdocao statusSolicitacao;

    private String tipoMoradia;
    private Boolean residenciaPermiteAnimais;
    private Boolean possuiOutrosAnimais;
    private String tempoAnimalSozinho;
    private String motivoAdocao;
    private String experienciaComAnimais;
    private BigDecimal rendaMensal;

    public Long getIdSolicitacao() {
        return idSolicitacao;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Animal getAnimal() {
        return animal;
    }

    public void setAnimal(Animal animal) {
        this.animal = animal;
    }

    public StatusSolicitacaoAdocao getStatusSolicitacao() {
        return statusSolicitacao;
    }

    public void setStatusSolicitacao(StatusSolicitacaoAdocao statusSolicitacao) {
        this.statusSolicitacao = statusSolicitacao;
    }

    public String getTipoMoradia() {
        return tipoMoradia;
    }

    public void setTipoMoradia(String tipoMoradia) {
        this.tipoMoradia = tipoMoradia;
    }

    public Boolean getResidenciaPermiteAnimais() {
        return residenciaPermiteAnimais;
    }

    public void setResidenciaPermiteAnimais(Boolean residenciaPermiteAnimais) {
        this.residenciaPermiteAnimais = residenciaPermiteAnimais;
    }

    public Boolean getPossuiOutrosAnimais() {
        return possuiOutrosAnimais;
    }

    public void setPossuiOutrosAnimais(Boolean possuiOutrosAnimais) {
        this.possuiOutrosAnimais = possuiOutrosAnimais;
    }

    public String getTempoAnimalSozinho() {
        return tempoAnimalSozinho;
    }

    public void setTempoAnimalSozinho(String tempoAnimalSozinho) {
        this.tempoAnimalSozinho = tempoAnimalSozinho;
    }

    public String getMotivoAdocao() {
        return motivoAdocao;
    }

    public void setMotivoAdocao(String motivoAdocao) {
        this.motivoAdocao = motivoAdocao;
    }

    public String getExperienciaComAnimais() {
        return experienciaComAnimais;
    }

    public void setExperienciaComAnimais(String experienciaComAnimais) {
        this.experienciaComAnimais = experienciaComAnimais;
    }

    public BigDecimal getRendaMensal() {
        return rendaMensal;
    }

    public void setRendaMensal(BigDecimal rendaMensal) {
        this.rendaMensal = rendaMensal;
    }
}