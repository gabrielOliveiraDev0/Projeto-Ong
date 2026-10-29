package com.projetoong.backend.model;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.*;
@Entity
@Table(name="conversas", uniqueConstraints=@UniqueConstraint(columnNames={"participante1_id","participante2_id"}))
public class Conversa {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long idConversa;
    @ManyToOne(optional=false) @JoinColumn(name="participante1_id")
    private Usuario participante1;
    @ManyToOne(optional=false) @JoinColumn(name="participante2_id")
    private Usuario participante2;
    
    private Instant dataCriacao;
    public Long getIdConversa() { return idConversa; }
    public void setIdConversa(Long value) { idConversa = value; }
    public Usuario getParticipante1() { return participante1; }
    public void setParticipante1(Usuario value) { participante1 = value; }
    public Usuario getParticipante2() { return participante2; }
    public void setParticipante2(Usuario value) { participante2 = value; }
    public Instant getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(Instant value) { dataCriacao = value; }
}
