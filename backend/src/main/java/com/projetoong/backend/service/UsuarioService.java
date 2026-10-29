package com.projetoong.backend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.nio.charset.StandardCharsets;
import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.projetoong.backend.model.AlterarSenhaRequest;
import com.projetoong.backend.model.PerfilUsuarioRequest;
import com.projetoong.backend.model.TipoUsuario;
import com.projetoong.backend.model.Usuario;
import com.projetoong.backend.model.UsuarioResponse;
import com.projetoong.backend.repository.UsuarioRepository;

@Service
public class UsuarioService {
    @org.springframework.beans.factory.annotation.Autowired
    private UploadService uploads;

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public java.util.List<UsuarioResponse> listar() {
        return usuarioRepository.findAll().stream().map(UsuarioResponse::de).toList();
    }

    public UsuarioResponse alterarTipo(Long id, TipoUsuario tipo) {
        if (tipo == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe o perfil");
        }

        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        usuario.setTipoUsuario(tipo);
        return UsuarioResponse.de(usuarioRepository.save(usuario));
    }

    public Usuario salvarUsuario(Usuario usuario) {
        if (
            usuario.getNomeUsuario() == null ||
            usuario.getNomeUsuario().isBlank() ||
            usuario.getEmailUsuario() == null ||
            !usuario.getEmailUsuario().matches("[^@\\s]+@[^@\\s]+\\.[^@\\s]+") ||
            usuario.getSenhaUsuario() == null ||
            usuario.getSenhaUsuario().length() < 6 ||
            usuario.getSenhaUsuario().getBytes(StandardCharsets.UTF_8).length > 72
        ) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Informe nome, e-mail válido e senha entre 6 e 72 bytes"
            );
        }

        if (usuarioRepository.existsByEmailUsuario(usuario.getEmailUsuario())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já cadastrado");
        }

        usuario.setTipoUsuario(TipoUsuario.USUARIO);
        usuario.setSenhaUsuario(passwordEncoder.encode(usuario.getSenhaUsuario()));

        return usuarioRepository.save(usuario);
    }

    public Usuario autenticarUsuario(String email, String senha) {
        Usuario usuario = usuarioRepository.findByEmailUsuario(email)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "E-mail ou senha inválidos"
            ));

        if (!passwordEncoder.matches(senha, usuario.getSenhaUsuario())) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "E-mail ou senha inválidos"
            );
        }

        return usuario;
    }

    public UsuarioResponse atualizarPerfil(Usuario autenticado, PerfilUsuarioRequest dados) {
        Usuario usuario = usuarioRepository.findById(autenticado.getIdUsuario())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        String nome = dados.nomeUsuario() == null ? "" : dados.nomeUsuario().trim();
        String sobrenome = dados.sobrenomeUsuario() == null ? "" : dados.sobrenomeUsuario().trim();
        String email = dados.emailUsuario() == null ? "" : dados.emailUsuario().trim().toLowerCase();
        String telefone = dados.telefoneUsuario() == null ? "" : dados.telefoneUsuario().trim();
        String regiao = dados.regiaoUsuario() == null ? "" : dados.regiaoUsuario().trim();

        if (nome.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe o nome");
        }

        if (!email.matches("[^@\\s]+@[^@\\s]+\\.[^@\\s]+")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe um e-mail válido");
        }

        usuarioRepository.findByEmailUsuario(email).ifPresent(outro -> {
            if (!outro.getIdUsuario().equals(usuario.getIdUsuario())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já cadastrado");
            }
        });

        usuario.setNomeUsuario(nome);
        usuario.setSobrenomeUsuario(sobrenome.isBlank() ? null : sobrenome);
        usuario.setEmailUsuario(email);
        usuario.setTelefoneUsuario(telefone.isBlank() ? null : telefone);
        usuario.setRegiaoUsuario(regiao.isBlank() ? null : regiao);

        return UsuarioResponse.de(usuarioRepository.save(usuario));
    }

    public void alterarSenha(Usuario autenticado, AlterarSenhaRequest dados) {
        Usuario usuario = usuarioRepository.findById(autenticado.getIdUsuario())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        if (dados.senhaAtual() == null || !passwordEncoder.matches(dados.senhaAtual(), usuario.getSenhaUsuario())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Senha atual incorreta");
        }

        if (
            dados.novaSenha() == null ||
            dados.novaSenha().length() < 6 ||
            dados.novaSenha().getBytes(StandardCharsets.UTF_8).length > 72
        ) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A nova senha deve ter entre 6 e 72 bytes");
        }

        usuario.setSenhaUsuario(passwordEncoder.encode(dados.novaSenha()));
        usuarioRepository.save(usuario);
    }

    public UsuarioResponse salvarFoto(Usuario autenticado, MultipartFile imagem) {
        validarImagem(imagem);

        Usuario usuario = usuarioRepository.findById(autenticado.getIdUsuario())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        Path pasta = uploads.pasta("perfis");

        try {
            Files.createDirectories(pasta);
            removerFotoLocal(usuario.getImagemPerfilUsuario());

            String extensao = extensaoImagem(imagem.getContentType());
            String nome = UUID.randomUUID() + extensao;

            Files.copy(
                imagem.getInputStream(),
                pasta.resolve(nome),
                StandardCopyOption.REPLACE_EXISTING
            );

            usuario.setImagemPerfilUsuario(nome);
            return UsuarioResponse.de(usuarioRepository.save(usuario));
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Não foi possível salvar a foto de perfil");
        }
    }

    public UsuarioResponse removerFoto(Usuario autenticado) {
        Usuario usuario = usuarioRepository.findById(autenticado.getIdUsuario())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        try {
            removerFotoLocal(usuario.getImagemPerfilUsuario());
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Não foi possível remover a foto de perfil");
        }

        usuario.setImagemPerfilUsuario(null);
        return UsuarioResponse.de(usuarioRepository.save(usuario));
    }

    private void validarImagem(MultipartFile imagem) {
        uploads.validar(imagem);
        String tipo = imagem == null || imagem.getContentType() == null ? "" : imagem.getContentType();

        if (
            imagem == null ||
            imagem.isEmpty() ||
            imagem.getSize() > 5 * 1024 * 1024 ||
            !Set.of("image/jpeg", "image/png", "image/webp").contains(tipo)
        ) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Envie uma imagem JPG, PNG ou WebP de até 5 MB");
        }
    }

    private String extensaoImagem(String tipo) {
        if ("image/png".equals(tipo)) return ".png";
        if ("image/webp".equals(tipo)) return ".webp";
        return ".jpg";
    }

    private void removerFotoLocal(String nome) throws IOException {
        if (nome == null || nome.isBlank()) return;
        Files.deleteIfExists(uploads.arquivo("perfis", nome));
    }
}
