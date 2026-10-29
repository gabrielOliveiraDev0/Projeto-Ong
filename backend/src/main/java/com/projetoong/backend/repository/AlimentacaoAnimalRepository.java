package com.projetoong.backend.repository;
import com.projetoong.backend.model.AlimentacaoAnimal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface AlimentacaoAnimalRepository extends JpaRepository<AlimentacaoAnimal,Long> {
    List<AlimentacaoAnimal> findByAtivaTrue();
}
