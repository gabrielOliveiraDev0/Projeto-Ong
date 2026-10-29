package com.projetoong.backend.repository;
import com.projetoong.backend.model.Mensagem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface MensagemRepository extends JpaRepository<Mensagem,Long> {
    List<Mensagem> findByConversaIdConversaOrderByIdMensagemAsc(Long id);
    Optional<Mensagem> findFirstByConversaIdConversaOrderByIdMensagemDesc(Long id);
    long countByConversaIdConversaAndRemetenteIdUsuarioNotAndLidaFalse(Long conversa,Long usuario);
}
