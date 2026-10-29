package com.projetoong.backend;

import com.projetoong.backend.config.AutorizacaoInterceptor;
import com.projetoong.backend.model.*;
import com.projetoong.backend.repository.RelatorioMensalRepository;
import com.projetoong.backend.service.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.web.server.ResponseStatusException;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;

class RelatorioMensalServiceTests {
    @Test
    void respeitaFusoFevereiroBissextoEViradaDeAno() {
        var repository = mock(RelatorioMensalRepository.class);
        var service = new RelatorioMensalService(repository);
        var fevereiro = service.gerar(2, 2024);
        assertEquals(29, fevereiro.diasDoMes());
        assertEquals(Instant.parse("2024-02-01T04:00:00Z"), fevereiro.inicio());
        assertEquals(Instant.parse("2024-03-01T04:00:00Z"), fevereiro.fimExclusivo());
        assertEquals(28, service.gerar(2, 2025).diasDoMes());
        assertEquals(30, service.gerar(4, 2026).diasDoMes());
        assertEquals(Instant.parse("2027-01-01T04:00:00Z"), service.gerar(12, 2026).fimExclusivo());
    }

    @Test
    void rejeitaPeriodoInvalidoAntesDeConsultarBanco() {
        var repository = mock(RelatorioMensalRepository.class);
        var service = new RelatorioMensalService(repository);
        for (int mes : new int[]{0, 13, -1}) assertThrows(ResponseStatusException.class, () -> service.gerar(mes, 2026));
        assertThrows(ResponseStatusException.class, () -> service.gerar(1, 0));
        assertThrows(ResponseStatusException.class, () -> service.gerar(1, 10000));
        verifyNoInteractions(repository);
    }

    @Test
    void somaGramasEQuilosComValoresDecimaisESeparaSaidas() {
        var repository = mock(RelatorioMensalRepository.class);
        when(repository.consumo(any(), any())).thenReturn(List.of(
                new Object[]{1L, "Ração G", "G", new BigDecimal("1500.5"), 2L},
                new Object[]{2L, "Ração KG", "KG", new BigDecimal("2.25"), 1L}));
        when(repository.racaoAtual()).thenReturn(List.<Object[]>of(new Object[]{"G", new BigDecimal("10000")}));
        when(repository.estoque(any(), any())).thenReturn(List.of(
                new Object[]{"ENTRADA", 2L, new BigDecimal("20.50")},
                new Object[]{"SAIDA", 1L, new BigDecimal("4.25")},
                new Object[]{"SAIDA_AUTOMATICA", 3L, new BigDecimal("3.75")}));
        var r = new RelatorioMensalService(repository).gerar(4, 2026);
        assertEquals(0, new BigDecimal("3.7505").compareTo(r.racao().consumidoKg()));
        assertEquals(0, new BigDecimal("10").compareTo(r.racao().estoqueAtualKg()));
        assertEquals(0, new BigDecimal("0.12501667").compareTo(r.racao().mediaDiariaKg()));
        assertEquals(3, r.racao().baixasAutomaticas());
        assertEquals(6, r.estoque().movimentacoes());
        assertEquals(1, r.estoque().saidas());
        assertEquals(0, new BigDecimal("8").compareTo(r.estoque().valorSaidas()));
    }

    @Test
    void protegeRelatoriosPorPerfil() {
        var jwt = mock(JwtService.class);
        var interceptor = new AutorizacaoInterceptor(jwt);
        var request = new MockHttpServletRequest("GET", "/relatorios/mensal");
        request.addHeader("Authorization", "Bearer teste");
        var usuario = new Usuario();
        when(jwt.autenticar("Bearer teste")).thenReturn(usuario);
        for (var tipo : List.of(TipoUsuario.USUARIO, TipoUsuario.VETERINARIO)) {
            usuario.setTipoUsuario(tipo);
            var erro = assertThrows(ResponseStatusException.class, () -> interceptor.preHandle(request, new MockHttpServletResponse(), new Object()));
            assertEquals(403, erro.getStatusCode().value());
        }
        usuario.setTipoUsuario(TipoUsuario.ADMINISTRADOR);
        assertTrue(interceptor.preHandle(request, new MockHttpServletResponse(), new Object()));
    }
}
