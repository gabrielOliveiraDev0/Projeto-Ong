package com.projetoong.backend;
import com.projetoong.backend.service.*;
import com.projetoong.backend.repository.UsuarioRepository;
import com.projetoong.backend.model.Usuario;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;
import java.nio.file.Path;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
class ProducaoTests {
    @TempDir Path temp;
    @Test void uploadsValidamConteudoExtensaoETamanho() throws Exception {
        var uploads = new UploadService(temp.toString());
        byte[] png = java.util.Base64.getDecoder().decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=");
        assertDoesNotThrow(() -> uploads.validar(new MockMultipartFile("imagem", "foto.png", "image/png", png)));
        assertThrows(Exception.class, () -> uploads.validar(new MockMultipartFile("imagem", "foto.html", "image/png", png)));
        assertThrows(Exception.class, () -> uploads.validar(new MockMultipartFile("imagem", "foto.png", "image/png", "<script>".getBytes())));
        assertThrows(Exception.class, () -> uploads.validar(new MockMultipartFile("imagem", "foto.png", "image/png", new byte[5 * 1024 * 1024 + 1])));
        assertThrows(Exception.class, () -> uploads.arquivo("holerites", "../segredo.png"));
        assertThrows(Exception.class, () -> uploads.arquivo("holerites", "/tmp/segredo.png"));
    }
    @Test void jwtExigeChaveEPreservaTokensEntreInstancias() {
        var repo = mock(UsuarioRepository.class);
        assertThrows(IllegalStateException.class, () -> new JwtService("", repo));
        assertThrows(IllegalStateException.class, () -> new JwtService("curta", repo));
        var u = mock(Usuario.class);
        when(u.getIdUsuario()).thenReturn(1L);
        when(u.getEmailUsuario()).thenReturn("teste@teste.test");
        when(u.getTipoUsuario()).thenReturn(com.projetoong.backend.model.TipoUsuario.USUARIO);
        when(repo.findById(1L)).thenReturn(java.util.Optional.of(u));
        String chave = "chave-exclusiva-de-teste-com-32-bytes";
        String token = new JwtService(chave, repo).gerarToken(u);
        assertSame(u, new JwtService(chave, repo).autenticar("Bearer " + token));
    }
}
