package com.projetoong.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.projetoong.backend.model.TipoUsuario;
import com.projetoong.backend.model.Usuario;
import com.projetoong.backend.repository.UsuarioRepository;
@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario salvarUsuario(Usuario usuario) {

        if (usuarioRepository.existsByEmailUsuario(usuario.getEmailUsuario())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "E-mail já cadastrado");
        }

        usuario.setTipoUsuario(TipoUsuario.USUARIO);

        String senhaCriptografada = passwordEncoder.encode(usuario.getSenhaUsuario());

        usuario.setSenhaUsuario(senhaCriptografada);

        return usuarioRepository.save(usuario);
    }
}