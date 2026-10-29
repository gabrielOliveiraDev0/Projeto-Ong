package com.projetoong.backend.repository;

import java.util.List;
import com.projetoong.backend.model.StatusAnimal;
import org.springframework.data.jpa.repository.JpaRepository;
import com.projetoong.backend.model.Animal;

public interface AnimalRepository extends JpaRepository<Animal, Long> {
    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @org.springframework.data.jpa.repository.Query("select a from Animal a where a.idAnimal = :id")
    java.util.Optional<Animal> bloquear(@org.springframework.data.repository.query.Param("id") Long id);
    List<Animal> findByStatusAnimal(StatusAnimal statusAnimal);

}