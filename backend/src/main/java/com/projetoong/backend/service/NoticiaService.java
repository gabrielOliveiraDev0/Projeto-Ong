package com.projetoong.backend.service;

import com.projetoong.backend.model.Noticia;
import com.projetoong.backend.model.NoticiaRequest;
import com.projetoong.backend.repository.NoticiaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class NoticiaService {
    private final NoticiaRepository noticias;

    public NoticiaService(NoticiaRepository noticias) {
        this.noticias = noticias;
    }

    public List<Noticia> listar() {
        return noticias.findAllByOrderByDataPublicacaoDesc();
    }

    public Noticia buscar(Long id) {
        return noticias.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notícia não encontrada"));
    }

    public Noticia salvar(Long id, NoticiaRequest dados) {
        Noticia noticia = id == null ? new Noticia() : buscar(id);
        noticia.setTituloNoticia(dados.tituloNoticia());
        noticia.setDescricaoNoticia(dados.descricaoNoticia());
        if (id == null) noticia.setDataPublicacao(Instant.now());
        return noticias.save(noticia);
    }

    public Noticia salvarImagem(Long id, MultipartFile imagem) throws IOException {
        Noticia noticia = buscar(id);
        String tipo = imagem.getContentType() == null ? "" : imagem.getContentType();

        if (imagem.isEmpty() || imagem.getSize() > 5 * 1024 * 1024 || !Set.of("image/jpeg", "image/png", "image/webp").contains(tipo)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Envie JPG, PNG ou WebP até 5 MB");
        }

        Path pasta = Paths.get("../uploads/noticias");
        Files.createDirectories(pasta);

        String extensao = "image/png".equals(tipo) ? ".png" : "image/webp".equals(tipo) ? ".webp" : ".jpg";
        String nomeArquivo = UUID.randomUUID() + extensao;
        Path caminho = pasta.resolve(nomeArquivo);

        Files.copy(imagem.getInputStream(), caminho, StandardCopyOption.REPLACE_EXISTING);

        String imagemAnterior = noticia.getImagemNoticia();
        noticia.setImagemNoticia(nomeArquivo);
        Noticia salva = noticias.save(noticia);

        if (imagemAnterior != null && !imagemAnterior.isBlank()) {
            Files.deleteIfExists(pasta.resolve(imagemAnterior));
        }

        return salva;
    }

    public void excluir(Long id) throws IOException {
        Noticia noticia = buscar(id);
        String imagem = noticia.getImagemNoticia();
        noticias.delete(noticia);

        if (imagem != null && !imagem.isBlank()) {
            Files.deleteIfExists(Paths.get("../uploads/noticias").resolve(imagem));
        }
    }
}
