package com.projetoong.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "movimentacoes_animais")
public class MovimentacaoAnimal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Animal animal;

    private String tipo;
    private String motivo;
    private Instant data;

    @Enumerated(EnumType.STRING)
    private StatusAnimal statusAnimal;

    public Long getId() {
        return id;
    }

    public Animal getAnimal() {
        return animal;
    }

    public void setAnimal(Animal animal) {
        this.animal = animal;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    public Instant getData() {
        return data;
    }

    public void setData(Instant data) {
        this.data = data;
    }

    public StatusAnimal getStatusAnimal() {
        return statusAnimal;
    }

    public void setStatusAnimal(StatusAnimal statusAnimal) {
        this.statusAnimal = statusAnimal;
    }
}
