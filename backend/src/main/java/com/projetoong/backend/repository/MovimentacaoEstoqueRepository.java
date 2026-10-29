package com.projetoong.backend.repository;
import com.projetoong.backend.model.MovimentacaoEstoque;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface MovimentacaoEstoqueRepository extends JpaRepository<MovimentacaoEstoque,Long> {
    List<MovimentacaoEstoque> findAllByOrderByDataDesc();
}
