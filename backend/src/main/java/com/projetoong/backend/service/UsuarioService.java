package com.projetoong.backend.service;

import org.springframework.stereotype.Service;
import com.projetoong.backend.model.TipoUsuario;
import com.projetoong.backend.model.Usuario;
import com.projetoong.backend.repository.UsuarioRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario salvarUsuario(Usuario usuario) {

        usuario.setTipoUsuario(TipoUsuario.USUARIO);

        String senhaCriptografada = passwordEncoder.encode(usuario.getSenhaUsuario());

        usuario.setSenhaUsuario(senhaCriptografada);

        return usuarioRepository.save(usuario);
    }
}