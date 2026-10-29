package com.projetoong.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    private final AutorizacaoInterceptor autorizacao;
    public WebConfig(AutorizacaoInterceptor autorizacao) { this.autorizacao = autorizacao; }
    @Override
    public void addInterceptors(org.springframework.web.servlet.config.annotation.InterceptorRegistry registry) { registry.addInterceptor(autorizacao); }
    @Override
    public void addCorsMappings(org.springframework.web.servlet.config.annotation.CorsRegistry registry) {
        registry.addMapping("/**").allowedOrigins("http://localhost:5173").allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS").allowedHeaders("*");
    }


    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry
            .addResourceHandler("/uploads/animais/**")
            .addResourceLocations("file:../uploads/animais/");

        registry
            .addResourceHandler("/uploads/noticias/**")
            .addResourceLocations("file:../uploads/noticias/");

        registry
            .addResourceHandler("/uploads/perfis/**")
            .addResourceLocations("file:../uploads/perfis/");
    }

}