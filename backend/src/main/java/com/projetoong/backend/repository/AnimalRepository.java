package com.projetoong.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.projetoong.backend.model.Animal;

public interface AnimalRepository extends JpaRepository<Animal, Long> {

}