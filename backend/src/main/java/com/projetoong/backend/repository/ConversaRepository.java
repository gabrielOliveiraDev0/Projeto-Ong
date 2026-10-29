package com.projetoong.backend.repository;
import com.projetoong.backend.model.Conversa;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface ConversaRepository extends JpaRepository<Conversa,Long> {
    List<Conversa> findByParticipante1IdUsuarioOrParticipante2IdUsuario(Long p1,Long p2);
    Optional<Conversa> findByParticipante1IdUsuarioAndParticipante2IdUsuario(Long p1,Long p2);
}
