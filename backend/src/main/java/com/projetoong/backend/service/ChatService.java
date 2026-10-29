package com.projetoong.backend.service;
import com.projetoong.backend.model.*;
import com.projetoong.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.time.Instant;
import java.util.*;
@Service
@Transactional
public class ChatService {
    private final ConversaRepository conversas;
    private final MensagemRepository mensagens;
    private final UsuarioRepository usuarios;
    public ChatService(ConversaRepository c,MensagemRepository m,UsuarioRepository u) { conversas=c; mensagens=m; usuarios=u; }
    public record Contato(Long idUsuario,String nomeUsuario,TipoUsuario tipoUsuario) {}
    public record MensagemResponse(Long idMensagem,Long idRemetente,String texto,Instant dataEnvio,boolean lida) {}
    public record ConversaResponse(Long idConversa,Contato participante,MensagemResponse ultimaMensagem,long naoLidas) {}
    private Contato contato(Usuario u) { return new Contato(u.getIdUsuario(),u.getNomeUsuario(),u.getTipoUsuario()); }
    private MensagemResponse mensagem(Mensagem m) { return new MensagemResponse(m.getIdMensagem(),m.getRemetente().getIdUsuario(),m.getTexto(),m.getDataEnvio(),m.getLida()); }
    private Conversa verificar(Long id,Usuario u) {
        Conversa c=conversas.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Conversa não encontrada"));
        if(!c.getParticipante1().getIdUsuario().equals(u.getIdUsuario()) && !c.getParticipante2().getIdUsuario().equals(u.getIdUsuario())) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        return c;
    }
    private ConversaResponse resumo(Conversa c,Usuario u) {
        Usuario outro=c.getParticipante1().getIdUsuario().equals(u.getIdUsuario())?c.getParticipante2():c.getParticipante1();
        return new ConversaResponse(c.getIdConversa(),contato(outro),mensagens.findFirstByConversaIdConversaOrderByIdMensagemDesc(c.getIdConversa()).map(this::mensagem).orElse(null),mensagens.countByConversaIdConversaAndRemetenteIdUsuarioNotAndLidaFalse(c.getIdConversa(),u.getIdUsuario()));
    }
    public List<Contato> contatos(Usuario u) { return usuarios.findAll().stream().filter(o->!o.getIdUsuario().equals(u.getIdUsuario()) && o.getTipoUsuario()!=u.getTipoUsuario()).map(this::contato).toList(); }
    public List<ConversaResponse> listar(Usuario u) { return conversas.findByParticipante1IdUsuarioOrParticipante2IdUsuario(u.getIdUsuario(),u.getIdUsuario()).stream().map(c->resumo(c,u)).toList(); }
    public ConversaResponse iniciar(Usuario u,Long destino) {
        if(destino==null || destino.equals(u.getIdUsuario())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Escolha outro participante");
        Long menor=Math.min(destino,u.getIdUsuario()), maior=Math.max(destino,u.getIdUsuario());
        Usuario p1=usuarios.bloquear(menor).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND));
        Usuario p2=usuarios.findById(maior).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND));
        if(p1.getTipoUsuario()==p2.getTipoUsuario()) throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Escolha um participante de outro perfil");
        Conversa c=conversas.findByParticipante1IdUsuarioAndParticipante2IdUsuario(menor,maior).orElseGet(()->{
            Conversa nova=new Conversa(); nova.setParticipante1(p1); nova.setParticipante2(p2); nova.setDataCriacao(Instant.now()); return conversas.save(nova);
        });
        return resumo(c,u);
    }
    public List<MensagemResponse> listarMensagens(Long id,Usuario u) { verificar(id,u); return mensagens.findByConversaIdConversaOrderByIdMensagemAsc(id).stream().map(this::mensagem).toList(); }
    public MensagemResponse enviar(Long id,Usuario u,String texto) {
        Conversa c=verificar(id,u); Mensagem m=new Mensagem(); m.setConversa(c); m.setRemetente(u); m.setTexto(texto.trim()); m.setDataEnvio(Instant.now()); m.setLida(false); return mensagem(mensagens.save(m));
    }
    public void ler(Long id,Usuario u,Long ate) {
        verificar(id,u);
        for(var m:mensagens.findByConversaIdConversaOrderByIdMensagemAsc(id)) if(m.getIdMensagem()<=ate && !m.getRemetente().getIdUsuario().equals(u.getIdUsuario())) m.setLida(true);
    }
}
