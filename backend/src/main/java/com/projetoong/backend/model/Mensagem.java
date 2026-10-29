package com.projetoong.backend.model;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.*;
@Entity
@Table(name="mensagens")
public class Mensagem {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long idMensagem;
    @ManyToOne(optional=false)
    private Conversa conversa;
    @ManyToOne(optional=false)
    private Usuario remetente;
    @Column(length=4000, nullable=false)
    private String texto;
    
    private Instant dataEnvio;
    
    private boolean lida;
    public Long getIdMensagem() { return idMensagem; }
    public void setIdMensagem(Long value) { idMensagem = value; }
    public Conversa getConversa() { return conversa; }
    public void setConversa(Conversa value) { conversa = value; }
    public Usuario getRemetente() { return remetente; }
    public void setRemetente(Usuario value) { remetente = value; }
    public String getTexto() { return texto; }
    public void setTexto(String value) { texto = value; }
    public Instant getDataEnvio() { return dataEnvio; }
    public void setDataEnvio(Instant value) { dataEnvio = value; }
    public boolean getLida() { return lida; }
    public void setLida(boolean value) { lida = value; }
}
