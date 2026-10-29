package com.projetoong.backend.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.config.annotation.*;
import com.projetoong.backend.service.UploadService;
@Configuration
public class WebConfig implements WebMvcConfigurer {
    private final AutorizacaoInterceptor autorizacao;
    private final UploadService uploads;
    private final String origem;
    public WebConfig(AutorizacaoInterceptor autorizacao, UploadService uploads, @Value("${app.frontend-url}") String origem) {
        this.autorizacao = autorizacao; this.uploads = uploads;
        if (origem.isBlank() || origem.contains("*") || !origem.matches("https?://[^/]+")) throw new IllegalStateException("Configure FRONTEND_URL com a origem completa, sem barra final.");
        this.origem = origem;
    }
    @Override public void addInterceptors(InterceptorRegistry registry) { registry.addInterceptor(autorizacao); }
    @Override public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**").allowedOrigins(origem).allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS").allowedHeaders("Authorization", "Content-Type", "Accept").maxAge(3600);
    }
    @Override public void addResourceHandlers(ResourceHandlerRegistry registry) {
        for (String categoria : new String[]{"animais", "noticias", "perfis"}) registry.addResourceHandler("/uploads/" + categoria + "/**").addResourceLocations(uploads.pasta(categoria).toUri().toString());
    }
}
