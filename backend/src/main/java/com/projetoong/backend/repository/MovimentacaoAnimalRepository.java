package com.projetoong.backend.repository;

import com.projetoong.backend.model.MovimentacaoAnimal;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovimentacaoAnimalRepository extends JpaRepository<MovimentacaoAnimal, Long> {
    List<MovimentacaoAnimal> findAllByOrderByDataDesc();
    boolean existsByAnimalIdAnimalAndTipo(Long idAnimal, String tipo);
}
