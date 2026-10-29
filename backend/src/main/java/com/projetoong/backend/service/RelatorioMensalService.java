package com.projetoong.backend.service;

import com.projetoong.backend.model.*;
import com.projetoong.backend.model.RelatorioMensalResponse.*;
import com.projetoong.backend.repository.RelatorioMensalRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.*;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class RelatorioMensalService {
    private static final ZoneId FUSO = ZoneId.of("America/Campo_Grande");
    private final RelatorioMensalRepository repository;

    public RelatorioMensalService(RelatorioMensalRepository repository) { this.repository = repository; }

    public static YearMonth validarPeriodo(int mes, int ano) {
        if (mes < 1 || mes > 12 || ano < 1 || ano > 9999)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe mês entre 1 e 12 e ano entre 1 e 9999");
        return YearMonth.of(ano, mes);
    }

    public static BigDecimal emKg(BigDecimal quantidade, String unidade) {
        if ("KG".equalsIgnoreCase(unidade)) return quantidade;
        if ("G".equalsIgnoreCase(unidade)) return quantidade.divide(BigDecimal.valueOf(1000));
        throw new ResponseStatusException(HttpStatus.CONFLICT, "Existe ração com unidade incompatível: " + unidade);
    }

    @Transactional(readOnly = true, isolation = Isolation.REPEATABLE_READ)
    public RelatorioMensalResponse gerar(int mes, int ano) {
        YearMonth periodo = validarPeriodo(mes, ano);
        Instant inicio = periodo.atDay(1).atStartOfDay(FUSO).toInstant();
        Instant fim = periodo.plusMonths(1).atDay(1).atStartOfDay(FUSO).toInstant();
        long entradas = 0, saidas = 0, adotados = 0;
        for (Object[] linha : repository.movimentosAnimais(inicio, fim)) {
            long quantidade = (Long) linha[2];
            if ("ENTRADA".equals(linha[0])) entradas += quantidade;
            if ("SAIDA".equals(linha[0])) {
                saidas += quantidade;
                if (linha[1] == StatusAnimal.ADOTADO) adotados += quantidade;
            }
        }
        Map<StatusAnimal, Long> status = new EnumMap<>(StatusAnimal.class);
        for (Object[] linha : repository.statusAtuais())
            if (linha[0] != null) status.put((StatusAnimal) linha[0], (Long) linha[1]);
        Animais animais = new Animais(entradas, saidas, entradas - saidas, adotados,
                status.getOrDefault(StatusAnimal.RESGATADO, 0L), status.getOrDefault(StatusAnimal.EM_TRATAMENTO, 0L),
                status.getOrDefault(StatusAnimal.DISPONIVEL, 0L), status.getOrDefault(StatusAnimal.ADOTADO, 0L));
        Adocoes adocoes = new Adocoes(
                repository.contar("SolicitacaoAdocao", "dataCriacao", "", inicio, fim),
                repository.contar("SolicitacaoAdocao", "dataDecisao", " and e.statusSolicitacao = com.projetoong.backend.model.StatusSolicitacaoAdocao.APROVADA", inicio, fim),
                repository.contar("SolicitacaoAdocao", "dataDecisao", " and e.statusSolicitacao = com.projetoong.backend.model.StatusSolicitacaoAdocao.RECUSADA", inicio, fim),
                repository.contar("SolicitacaoAdocao", "dataCriacao", " and (e.dataDecisao >= :fim or (e.dataDecisao is null and e.statusSolicitacao = com.projetoong.backend.model.StatusSolicitacaoAdocao.PENDENTE))", inicio, fim));
        long entradasEstoque = 0, saidasEstoque = 0, automaticas = 0, movimentos = 0;
        BigDecimal valorEntradas = BigDecimal.ZERO, valorSaidas = BigDecimal.ZERO;
        for (Object[] linha : repository.estoque(inicio, fim)) {
            long quantidade = (Long) linha[1];
            BigDecimal valor = linha[2] == null ? BigDecimal.ZERO : (BigDecimal) linha[2];
            movimentos += quantidade;
            switch ((String) linha[0]) {
                case "ENTRADA" -> { entradasEstoque += quantidade; valorEntradas = valorEntradas.add(valor); }
                case "SAIDA" -> { saidasEstoque += quantidade; valorSaidas = valorSaidas.add(valor); }
                case "SAIDA_AUTOMATICA" -> { automaticas += quantidade; valorSaidas = valorSaidas.add(valor); }
                default -> { }
            }
        }
        Estoque estoque = new Estoque(entradasEstoque, saidasEstoque, automaticas, movimentos, valorEntradas, valorSaidas);
        List<ConsumoRacao> porRacao = new ArrayList<>();
        BigDecimal consumo = BigDecimal.ZERO, atual = BigDecimal.ZERO;
        long baixas = 0;
        for (Object[] linha : repository.consumo(inicio, fim)) {
            BigDecimal kg = emKg((BigDecimal) linha[3], (String) linha[2]);
            consumo = consumo.add(kg);
            baixas += (Long) linha[4];
            porRacao.add(new ConsumoRacao((Long) linha[0], (String) linha[1], kg));
        }
        for (Object[] linha : repository.racaoAtual()) atual = atual.add(emKg((BigDecimal) linha[1], (String) linha[0]));
        Racao racao = new Racao(consumo, consumo.divide(BigDecimal.valueOf(periodo.lengthOfMonth()), 8, RoundingMode.HALF_UP), atual, baixas, porRacao);
        Map<TipoUsuario, Long> tipos = new EnumMap<>(TipoUsuario.class);
        long novos = 0;
        for (Object[] linha : repository.usuarios(inicio, fim)) {
            novos += (Long) linha[1];
            if (linha[0] != null) tipos.put((TipoUsuario) linha[0], (Long) linha[1]);
        }
        Usuarios usuarios = new Usuarios(novos, tipos.getOrDefault(TipoUsuario.USUARIO, 0L),
                tipos.getOrDefault(TipoUsuario.VETERINARIO, 0L), tipos.getOrDefault(TipoUsuario.ADMINISTRADOR, 0L));
        var publicacoes = repository.noticias(inicio, fim).stream()
                .map(n -> new NoticiaResumo((Long) n[0], (String) n[1], (Instant) n[2])).toList();
        Chat chat = new Chat(repository.contar("Conversa", "dataCriacao", "", inicio, fim),
                repository.contar("Mensagem", "dataEnvio", "", inicio, fim));
        List<String> notas = new ArrayList<>(List.of(
                "Status dos animais e estoque de ração representam os saldos atuais, não o fechamento histórico do mês.",
                "Aprovações e recusas são contadas pela data da decisão, inclusive de solicitações de outros meses. Pendentes são solicitações criadas no mês ainda sem decisão ao fim do período (ou até agora no mês em andamento).",
                "Consumo corresponde às baixas automáticas registradas no mês, pela data da movimentação. Recuperações após servidor desligado entram no mês do lançamento. Saídas manuais não são consideradas alimentação.",
                "Média diária = consumo registrado dividido pelos " + periodo.lengthOfMonth() + " dias do mês, mesmo quando o mês está em andamento.",
                "Tipos de novos usuários correspondem aos perfis atuais. Notícias excluídas não constam na lista.",
                "Movimentações de animais incorporadas de registros antigos, sem data original comprovada, não integram as contagens mensais."));
        long usuariosSemData = repository.contarSemData("Usuario", "dataCadastro");
        long solicitacoesSemData = repository.contarSemData("SolicitacaoAdocao", "dataCriacao");
        if (usuariosSemData > 0 || solicitacoesSemData > 0)
            notas.add("Histórico anterior incompleto: " + usuariosSemData + " usuários e " + solicitacoesSemData + " solicitações sem data de criação. Datas desconhecidas não foram estimadas; decisões antigas sem data também não são contadas.");
        return new RelatorioMensalResponse(mes, ano, FUSO.getId(), inicio, fim, Instant.now(), periodo.lengthOfMonth(),
                animais, adocoes, estoque, racao, usuarios, new Noticias(publicacoes.size(), publicacoes), chat, notas);
    }
}
