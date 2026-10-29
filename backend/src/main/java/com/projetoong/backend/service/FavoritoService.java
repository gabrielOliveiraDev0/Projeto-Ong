package com.projetoong.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.projetoong.backend.model.Animal;
import com.projetoong.backend.model.Favorito;
import com.projetoong.backend.model.Usuario;
import com.projetoong.backend.repository.AnimalRepository;
import com.projetoong.backend.repository.FavoritoRepository;
import com.projetoong.backend.repository.UsuarioRepository;

@Service
@org.springframework.transaction.annotation.Transactional
public class FavoritoService {

    private final FavoritoRepository favoritoRepository;
    private final UsuarioRepository usuarioRepository;
    private final AnimalRepository animalRepository;

    public FavoritoService(
        FavoritoRepository favoritoRepository,
        UsuarioRepository usuarioRepository,
        AnimalRepository animalRepository
    ) {
        this.favoritoRepository = favoritoRepository;
        this.usuarioRepository = usuarioRepository;
        this.animalRepository = animalRepository;
    }

    public Favorito adicionar(Long idUsuario, Long idAnimal) {

        usuarioRepository.bloquear(idUsuario).orElseThrow();
        if (favoritoRepository
            .existsByUsuarioIdUsuarioAndAnimalIdAnimal(
                idUsuario,
                idAnimal
            )) {

            return favoritoRepository.findByUsuarioIdUsuario(idUsuario).stream().filter(f -> f.getAnimal().getIdAnimal().equals(idAnimal)).findFirst().orElseThrow();
        }

        Usuario usuario = usuarioRepository.findById(idUsuario)
            .orElseThrow(() ->
                new RuntimeException("Usuário não encontrado")
            );

        Animal animal = animalRepository.findById(idAnimal)
            .orElseThrow(() ->
                new RuntimeException("Animal não encontrado")
            );

        Favorito favorito = new Favorito();

        favorito.setUsuario(usuario);
        favorito.setAnimal(animal);

        return favoritoRepository.save(favorito);
    }

    public List<Favorito> listar(Long idUsuario) {
        return favoritoRepository.findByUsuarioIdUsuario(idUsuario);
    }

    public void remover(Long idUsuario, Long idAnimal) {

        favoritoRepository
            .deleteByUsuarioIdUsuarioAndAnimalIdAnimal(
                idUsuario,
                idAnimal
            );
    }
}