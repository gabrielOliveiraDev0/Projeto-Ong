package com.projetoong.backend.model;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record RelatorioMensalResponse(
        int mes, int ano, String fusoHorario, Instant inicio, Instant fimExclusivo,
        Instant geradoEm, int diasDoMes, Animais animais, Adocoes adocoes,
        Estoque estoque, Racao racao, Usuarios usuarios, Noticias noticias, Chat chat,
        List<String> observacoes) {
    public record Animais(long entradas, long saidas, long saldoMovimentacao, long adotadosNoMes,
            long resgatados, long emTratamento, long disponiveis, long adotados) {}
    public record Adocoes(long solicitacoes, long aprovadas, long recusadas, long pendentes) {}
    public record Estoque(long entradas, long saidas, long saidasAutomaticas, long movimentacoes,
            BigDecimal valorEntradas, BigDecimal valorSaidas) {}
    public record ConsumoRacao(Long id, String nome, BigDecimal consumidoKg) {}
    public record Racao(BigDecimal consumidoKg, BigDecimal mediaDiariaKg, BigDecimal estoqueAtualKg,
            long baixasAutomaticas, List<ConsumoRacao> porRacao) {}
    public record Usuarios(long novos, long usuarios, long veterinarios, long administradores) {}
    public record NoticiaResumo(Long id, String titulo, Instant data) {}
    public record Noticias(long quantidade, List<NoticiaResumo> publicacoes) {}
    public record Chat(long novasConversas, long mensagens) {}
}
