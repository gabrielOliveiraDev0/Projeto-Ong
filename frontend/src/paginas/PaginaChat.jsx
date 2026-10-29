import { useEffect, useState } from "react";
import Painel from "../componentes/Painel";
import { useAutenticacao } from "../servicos/contextoAutenticacao";
import { useConsulta } from "../servicos/useConsulta";
import { api } from "../servicos/api";
function ConversaAberta({ conversa, atualizarConversas }) {
    const { usuario } = useAutenticacao();
    const { dados, erro, atualizar } = useConsulta(`/chat/conversas/${conversa.idConversa}/mensagens`);
    const [texto, setTexto] = useState(""), [aviso, setAviso] = useState(""), [enviando, setEnviando] = useState(false);
    const ultimaNaoLida = dados.filter(m => m.idRemetente !== usuario.idUsuario && !m.lida).at(-1)?.idMensagem;
    useEffect(() => {
        if (!ultimaNaoLida) return;
        let ativo = true;
        api(`/chat/conversas/${conversa.idConversa}/lidas`, "PATCH", { ateMensagem: ultimaNaoLida }).then(() => { if (ativo) atualizarConversas(); }).catch(e => { if (ativo) setAviso(e.message); });
        return () => { ativo = false; };
    }, [ultimaNaoLida, conversa.idConversa, atualizarConversas]);
    async function enviar(e) {
        e.preventDefault(); if (!texto.trim()) return; setEnviando(true);
        try { await api(`/chat/conversas/${conversa.idConversa}/mensagens`, "POST", { texto }); setTexto(""); setAviso(""); await Promise.all([atualizar(), atualizarConversas()]); }
        catch(e) { setAviso(e.message); } finally { setEnviando(false); }
    }
    return <section><h2>{conversa.participante.nomeUsuario}</h2><p>{conversa.participante.tipoUsuario}</p>{(erro || aviso) && <p role="alert">{erro || aviso}</p>}<div className="mensagens" aria-live="polite">{dados.map(m => <p className={`mensagem ${m.idRemetente === usuario.idUsuario ? "minha" : ""}`} key={m.idMensagem}><strong>{m.idRemetente === usuario.idUsuario ? "Você" : conversa.participante.nomeUsuario}</strong><br />{m.texto}<br /><small>{new Date(m.dataEnvio).toLocaleString("pt-BR")} {m.idRemetente === usuario.idUsuario && (m.lida ? "· Lida" : "· Enviada")}</small></p>)}</div><form onSubmit={enviar}><label>Mensagem<textarea required maxLength={4000} value={texto} onChange={e => setTexto(e.target.value)} /></label><button disabled={enviando || !texto.trim()}>Enviar</button></form></section>;
}
export default function PaginaChat() {
    const { dados:conversas, erro, atualizar } = useConsulta("/chat/conversas");
    const { dados:contatos, erro:erroContatos } = useConsulta("/chat/contatos");
    const [selecionada, setSelecionada] = useState(null), [destino, setDestino] = useState(""), [aviso, setAviso] = useState(""), [criando, setCriando] = useState(false);
    const conversa = conversas.find(c => c.idConversa === selecionada);
    async function iniciar(e) {
        e.preventDefault(); setCriando(true);
        try { const c = await api("/chat/conversas", "POST", { idUsuario:Number(destino) }); await atualizar(); setSelecionada(c.idConversa); setAviso(""); }
        catch(e) { setAviso(e.message); } finally { setCriando(false); }
    }
    return <Painel titulo="Chat interno" erro={erro || erroContatos || aviso}><form onSubmit={iniciar}><label>Nova conversa<select required value={destino} onChange={e => setDestino(e.target.value)}><option value="">Selecione um contato</option>{contatos.map(c => <option key={c.idUsuario} value={c.idUsuario}>{c.nomeUsuario} — {c.tipoUsuario}</option>)}</select></label><button disabled={criando || !destino}>Iniciar conversa</button></form><div className="chat"><aside><h2>Conversas</h2>{!conversas.length && <p>Nenhuma conversa iniciada.</p>}{conversas.map(c => <article key={c.idConversa}><button aria-pressed={selecionada === c.idConversa} onClick={() => setSelecionada(c.idConversa)}>{c.participante.nomeUsuario} {c.naoLidas > 0 && `(${c.naoLidas} novas)`}</button><p>{c.participante.tipoUsuario}</p><p>{c.ultimaMensagem?.texto || "Conversa iniciada"}</p></article>)}</aside>{conversa ? <ConversaAberta key={conversa.idConversa} conversa={conversa} atualizarConversas={atualizar} /> : <p>Selecione uma conversa.</p>}</div></Painel>;
}
