package com.projetoong.backend.repository;

import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public class RelatorioMensalRepository {
    private final EntityManager em;

    public RelatorioMensalRepository(EntityManager em) { this.em = em; }

    public long contar(String entidade, String campo, String condicao, Instant inicio, Instant fim) {
        return em.createQuery("select count(e) from " + entidade + " e where e." + campo
                + " >= :inicio and e." + campo + " < :fim" + condicao, Long.class)
                .setParameter("inicio", inicio).setParameter("fim", fim).getSingleResult();
    }

    public long contarSemData(String entidade, String campo) {
        return em.createQuery("select count(e) from " + entidade + " e where e." + campo + " is null", Long.class)
                .getSingleResult();
    }

    public List<Object[]> movimentosAnimais(Instant inicio, Instant fim) {
        return em.createQuery("""
                select m.tipo, m.statusAnimal, count(m) from MovimentacaoAnimal m
                where m.data >= :inicio and m.data < :fim
                and (m.motivo is null or m.motivo not in
                    ('Registro incorporado ao controle de animais', 'Adoção registrada anteriormente', 'Saída registrada anteriormente'))
                group by m.tipo, m.statusAnimal
                """, Object[].class).setParameter("inicio", inicio).setParameter("fim", fim).getResultList();
    }

    public List<Object[]> statusAtuais() {
        return em.createQuery("select a.statusAnimal, count(a) from Animal a where a.removido = false group by a.statusAnimal", Object[].class).getResultList();
    }

    public List<Object[]> estoque(Instant inicio, Instant fim) {
        return em.createQuery("""
                select m.tipo, count(m), sum(m.quantidade * m.valorUnitario)
                from MovimentacaoEstoque m where m.data >= :inicio and m.data < :fim group by m.tipo
                """, Object[].class).setParameter("inicio", inicio).setParameter("fim", fim).getResultList();
    }

    public List<Object[]> consumo(Instant inicio, Instant fim) {
        return em.createQuery("""
                select m.item.id, m.item.nome, m.item.unidade, sum(m.quantidade), count(m)
                from MovimentacaoEstoque m where m.data >= :inicio and m.data < :fim
                and m.tipo = 'SAIDA_AUTOMATICA' and m.item.categoria = com.projetoong.backend.model.CategoriaEstoque.RACAO
                group by m.item.id, m.item.nome, m.item.unidade order by m.item.nome, m.item.id
                """, Object[].class).setParameter("inicio", inicio).setParameter("fim", fim).getResultList();
    }

    public List<Object[]> racaoAtual() {
        return em.createQuery("""
                select i.unidade, sum(i.quantidade) from ItemEstoque i
                where i.excluido = false and i.categoria = com.projetoong.backend.model.CategoriaEstoque.RACAO
                group by i.unidade
                """, Object[].class).getResultList();
    }

    public List<Object[]> usuarios(Instant inicio, Instant fim) {
        return em.createQuery("""
                select u.tipoUsuario, count(u) from Usuario u where u.dataCadastro >= :inicio
                and u.dataCadastro < :fim group by u.tipoUsuario
                """, Object[].class).setParameter("inicio", inicio).setParameter("fim", fim).getResultList();
    }

    public List<Object[]> noticias(Instant inicio, Instant fim) {
        return em.createQuery("""
                select n.idNoticia, n.tituloNoticia, n.dataPublicacao from Noticia n
                where n.dataPublicacao >= :inicio and n.dataPublicacao < :fim order by n.dataPublicacao, n.idNoticia
                """, Object[].class).setParameter("inicio", inicio).setParameter("fim", fim).getResultList();
    }
}
