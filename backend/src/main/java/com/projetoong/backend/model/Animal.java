package com.projetoong.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "animais")

public class Animal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    
    private Long idAnimal; 
    
    private String imagemAnimal;
    private Integer idadeAnimal;
    private String nomeAnimal;
    private String tipoAnimal;
    private String sexoAnimal;
    private String regiaoAnimal;
    private Double pesoAnimal;
    private String estadoSaudeAnimal;
    private Boolean castracaoAnimal;
    private String descricaoAnimal;
    private String telefoneAnimal;
    private String pessoaParaContatoAnimal;

    public Long getIdAnimal() {
        return idAnimal;
    }

    public void setIdadeAnimal(Integer idadeAnimal) {
        this.idadeAnimal = idadeAnimal;
    }

    public Integer getIdadeAnimal() {
        return idadeAnimal;
    }

    public void setNomeAnimal(String nomeAnimal) {
        this.nomeAnimal = nomeAnimal;
    }

    public String getNomeAnimal() {
        return nomeAnimal;
    }

    public void setTipoAnimal(String tipoAnimal) {
        this.tipoAnimal = tipoAnimal;
    }

    public String getTipoAnimal() {
        return tipoAnimal;
    }

    public void setSexoAnimal(String sexoAnimal) {
        this.sexoAnimal = sexoAnimal;
    }

    public String getSexoAnimal() {
        return sexoAnimal;
    }

    public void setRegiaoAnimal(String regiaoAnimal) {
        this.regiaoAnimal = regiaoAnimal;
    }

    public String getRegiaoAnimal() {
        return regiaoAnimal;
    }

    public void setPesoAnimal(Double pesoAnimal) {
        this.pesoAnimal = pesoAnimal;
    }

    public Double getPesoAnimal() {
        return pesoAnimal;
    }

    public void setEstadoSaudeAnimal(String estadoSaudeAnimal) {
        this.estadoSaudeAnimal = estadoSaudeAnimal;
    }

    public String getEstadoSaudeAnimal() {
        return estadoSaudeAnimal;
    }

    public Boolean getCastracaoAnimal() {
        return castracaoAnimal;
    }

    public void setCastracaoAnimal(Boolean castracaoAnimal) {
        this.castracaoAnimal = castracaoAnimal;
    }

    public String getDescricaoAnimal() {
        return descricaoAnimal;
    }

    public void setDescricaoAnimal(String descricaoAnimal) {
        this.descricaoAnimal = descricaoAnimal;
    }

    public String getTelefoneAnimal() {
        return telefoneAnimal;
    }

    public void setTelefoneAnimal(String telefoneAnimal) {
        this.telefoneAnimal = telefoneAnimal;
    }

    public String getPessoaParaContatoAnimal() {
        return pessoaParaContatoAnimal;
    }

    public void setPessoaParaContatoAnimal(String pessoaParaContatoAnimal) {
        this.pessoaParaContatoAnimal = pessoaParaContatoAnimal;
    }

    public String getImagemAnimal() {
        return imagemAnimal;
    }

    public void setImagemAnimal(String imagemAnimal) {
        this.imagemAnimal = imagemAnimal;
    }

}
