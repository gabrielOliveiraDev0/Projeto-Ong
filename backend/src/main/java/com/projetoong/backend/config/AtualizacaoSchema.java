package com.projetoong.backend.config;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.DependsOn;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
@Component
@DependsOn("entityManagerFactory")
public class AtualizacaoSchema implements ApplicationRunner {
    private final JdbcTemplate jdbc;
    public AtualizacaoSchema(JdbcTemplate jdbc) { this.jdbc=jdbc; }
    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        jdbc.execute("""
            DO $$ BEGIN
                IF EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='usuarios'::regclass
                    AND conname='usuarios_tipo_usuario_check' AND contype='c'
                    AND pg_get_constraintdef(oid) NOT LIKE '%VETERINARIO%') THEN
                    ALTER TABLE usuarios DROP CONSTRAINT usuarios_tipo_usuario_check;
                    ALTER TABLE usuarios ADD CONSTRAINT usuarios_tipo_usuario_check
                        CHECK (tipo_usuario IN ('USUARIO','ADMINISTRADOR','VETERINARIO'));
                END IF;
            END $$
            """);
        jdbc.execute("CREATE UNIQUE INDEX IF NOT EXISTS alimentacao_animal_ativa_unica ON alimentacoes_animais (animal_id_animal) WHERE ativa = true");
    }
}
