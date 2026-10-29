package com.projetoong.backend.model;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.*;
@Entity
@Table(name="noticias")
public class Noticia {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long idNoticia;
    
    private String tituloNoticia;
    @Column(length=20000)
    private String descricaoNoticia;
    @Column(length=2000)
    private String imagemNoticia;
    
    private Instant dataPublicacao;
    public Long getIdNoticia() { return idNoticia; }
    public void setIdNoticia(Long value) { idNoticia = value; }
    public String getTituloNoticia() { return tituloNoticia; }
    public void setTituloNoticia(String value) { tituloNoticia = value; }
    public String getDescricaoNoticia() { return descricaoNoticia; }
    public void setDescricaoNoticia(String value) { descricaoNoticia = value; }
    public String getImagemNoticia() { return imagemNoticia; }
    public void setImagemNoticia(String value) { imagemNoticia = value; }
    public Instant getDataPublicacao() { return dataPublicacao; }
    public void setDataPublicacao(Instant value) { dataPublicacao = value; }
}
