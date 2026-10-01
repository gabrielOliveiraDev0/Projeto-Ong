package com.projetoong.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.projetoong.backend.model.Usuario;



public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    boolean existsByEmailUsuario(String emailUsuario);

    Optional<Usuario> findByEmailUsuario(String emailUsuario);
}