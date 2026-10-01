package com.projetoong.backend.repository;

import java.util.List;
import com.projetoong.backend.model.StatusAnimal;
import org.springframework.data.jpa.repository.JpaRepository;
import com.projetoong.backend.model.Animal;

public interface AnimalRepository extends JpaRepository<Animal, Long> {
    List<Animal> findByStatusAnimal(StatusAnimal statusAnimal);

}