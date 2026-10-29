package com.projetoong.backend.controller;
import com.projetoong.backend.service.*;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;
@RestController
@RequestMapping("/chat")
public class ChatController {
    private final ChatService service;
    private final JwtService jwt;
    public ChatController(ChatService s,JwtService j) { service=s; jwt=j; }
    public record NovaConversa(@NotNull Long idUsuario) {}
    public record Texto(@NotBlank @Size(max=4000) String texto) {}
    public record Leitura(@NotNull @Positive Long ateMensagem) {}
    @GetMapping("/contatos") public List<ChatService.Contato> contatos(@RequestHeader("Authorization") String auth) { return service.contatos(jwt.autenticar(auth)); }
    @GetMapping("/conversas") public List<ChatService.ConversaResponse> listar(@RequestHeader("Authorization") String auth) { return service.listar(jwt.autenticar(auth)); }
    @PostMapping("/conversas") public ChatService.ConversaResponse criar(@RequestHeader("Authorization") String auth,@Valid @RequestBody NovaConversa d) { return service.iniciar(jwt.autenticar(auth),d.idUsuario()); }
    @GetMapping("/conversas/{id}/mensagens") public List<ChatService.MensagemResponse> mensagens(@RequestHeader("Authorization") String auth,@PathVariable Long id) { return service.listarMensagens(id,jwt.autenticar(auth)); }
    @PostMapping("/conversas/{id}/mensagens") public ChatService.MensagemResponse enviar(@RequestHeader("Authorization") String auth,@PathVariable Long id,@Valid @RequestBody Texto d) { return service.enviar(id,jwt.autenticar(auth),d.texto()); }
    @PatchMapping("/conversas/{id}/lidas") public void ler(@RequestHeader("Authorization") String auth,@PathVariable Long id,@Valid @RequestBody Leitura d) { service.ler(id,jwt.autenticar(auth),d.ateMensagem()); }
}
