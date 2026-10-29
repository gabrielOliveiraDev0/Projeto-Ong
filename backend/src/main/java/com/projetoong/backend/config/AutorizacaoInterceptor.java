package com.projetoong.backend.config;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import com.projetoong.backend.service.JwtService;
import com.projetoong.backend.model.TipoUsuario;
@Component
public class AutorizacaoInterceptor implements HandlerInterceptor {
    private final JwtService jwt;
    public AutorizacaoInterceptor(JwtService jwt) { this.jwt = jwt; }
    public boolean preHandle(HttpServletRequest r, HttpServletResponse response, Object handler) {
        String p = r.getRequestURI(), m = r.getMethod();
        if (m.equals("OPTIONS")) return true;
        boolean estoqueVeterinario = p.equals("/estoque/racoes") && m.equals("GET")
            || p.matches("/estoque/racoes/\\d+/consumo") && m.equals("PATCH");
        boolean usuarioProprio = p.startsWith("/usuarios/me");
        boolean admin = p.startsWith("/estoque") && !estoqueVeterinario
            || p.equals("/animais/relatorio")
            || (p.startsWith("/usuarios") && !usuarioProprio && !m.equals("POST"))
            || (p.startsWith("/noticias") && !m.equals("GET"))
            || (p.startsWith("/animais") && !m.equals("GET") && !p.endsWith("/veterinario"))
            || p.equals("/adocoes/pendentes") || p.matches("/adocoes/\\d+/(aprovar|recusar)");
        boolean vet = p.endsWith("/veterinario") || estoqueVeterinario;
        if (admin || vet || usuarioProprio || p.startsWith("/chat") || p.startsWith("/favoritos") || p.startsWith("/adocoes")) {
            var u = jwt.autenticar(r.getHeader("Authorization"));
            if (admin && u.getTipoUsuario() != TipoUsuario.ADMINISTRADOR || vet && u.getTipoUsuario() == TipoUsuario.USUARIO)
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Sem permissão para esta operação");
        }
        return true;
    }
}
