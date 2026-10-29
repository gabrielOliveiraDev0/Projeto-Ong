package com.projetoong.backend.service;
import java.io.IOException;
import java.nio.file.*;
import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
@Service
public class UploadService {
    private final Path raiz;
    public UploadService(@Value("${app.upload-dir}") String diretorio) throws IOException {
        if (diretorio.isBlank()) throw new IllegalStateException("Configure UPLOAD_DIR");
        raiz = Path.of(diretorio).toAbsolutePath().normalize();
        for (String categoria : Set.of("animais", "noticias", "perfis", "holerites")) Files.createDirectories(raiz.resolve(categoria));
    }
    public Path pasta(String categoria) {
        if (!Set.of("animais", "noticias", "perfis", "holerites").contains(categoria)) throw new IllegalArgumentException("Categoria inválida");
        return raiz.resolve(categoria);
    }
    public Path arquivo(String categoria, String nome) {
        if (nome == null || !nome.matches("[a-zA-Z0-9_-]+\\.(jpg|jpeg|png|webp)")) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nome de arquivo inválido");
        Path p = pasta(categoria).resolve(nome).normalize();
        if (!p.getParent().equals(pasta(categoria)) || Files.isSymbolicLink(p)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Arquivo inválido");
        return p;
    }
    public void validar(MultipartFile file) {
        try {
            if (file == null || file.isEmpty() || file.getSize() > 5L * 1024 * 1024) throw new IOException();
            String nome = Optional.ofNullable(file.getOriginalFilename()).orElse("").toLowerCase(Locale.ROOT);
            String tipo = Optional.ofNullable(file.getContentType()).orElse("");
            byte[] bytes;
            try (var in = file.getInputStream()) { bytes = in.readNBytes(12); }
            boolean png = tipo.equals("image/png") && nome.endsWith(".png") && bytes.length >= 8 && Arrays.equals(Arrays.copyOf(bytes, 8), new byte[]{(byte)137,80,78,71,13,10,26,10});
            boolean jpg = tipo.equals("image/jpeg") && (nome.endsWith(".jpg") || nome.endsWith(".jpeg")) && bytes.length >= 3 && bytes[0] == (byte)255 && bytes[1] == (byte)216 && bytes[2] == (byte)255;
            boolean webp = tipo.equals("image/webp") && nome.endsWith(".webp") && bytes.length == 12 && new String(bytes,0,4,java.nio.charset.StandardCharsets.US_ASCII).equals("RIFF") && new String(bytes,8,4,java.nio.charset.StandardCharsets.US_ASCII).equals("WEBP");
            if (!png && !jpg && !webp) throw new IOException();
        } catch (IOException e) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Envie JPG, PNG ou WebP válido de até 5 MB, com extensão e tipo correspondentes."); }
    }
}
