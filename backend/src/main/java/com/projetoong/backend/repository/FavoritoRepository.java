package com.projetoong.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import com.projetoong.backend.model.Favorito;

public interface FavoritoRepository extends JpaRepository<Favorito, Long> {

    List<Favorito> findByUsuarioIdUsuario(Long idUsuario);

    boolean existsByUsuarioIdUsuarioAndAnimalIdAnimal(
        Long idUsuario,
        Long idAnimal
    );

    @Transactional
    void deleteByUsuarioIdUsuarioAndAnimalIdAnimal(
        Long idUsuario,
        Long idAnimal
    );
}