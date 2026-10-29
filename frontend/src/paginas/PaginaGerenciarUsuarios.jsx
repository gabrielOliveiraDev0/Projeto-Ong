import { useState } from "react";
import Painel from "../componentes/Painel";
import { api } from "../servicos/api";
import { useConsulta } from "../servicos/useConsulta";
export default function PaginaGerenciarUsuarios() {
    const { dados, erro, atualizar } = useConsulta("/usuarios");
    const [tipos, setTipos] = useState({});
    const [aviso, setAviso] = useState("");
    const [ocupado, setOcupado] = useState(false);
    async function salvar(u) {
        setOcupado(true);
        try { await api(`/usuarios/${u.idUsuario}/tipo`, "PATCH", { tipoUsuario: tipos[u.idUsuario] || u.tipoUsuario }); await atualizar(); setAviso("Privilégios atualizados."); }
        catch(e) { setAviso(e.message); } finally { setOcupado(false); }
    }
    return <Painel titulo="Gerenciar usuários" erro={erro || aviso}><div className="rolagem"><table><thead><tr><th>ID</th><th>Nome</th><th>E-mail</th><th>Telefone</th><th>Tipo atual</th><th>Novo tipo</th><th>Ação</th></tr></thead><tbody>{dados.map(u => <tr key={u.idUsuario}><td>{u.idUsuario}</td><td>{u.nomeUsuario} {u.sobrenomeUsuario}</td><td>{u.emailUsuario}</td><td>{u.telefoneUsuario || "—"}</td><td>{u.tipoUsuario}</td><td><select aria-label={`Perfil de ${u.nomeUsuario}`} value={tipos[u.idUsuario] || u.tipoUsuario} onChange={e => setTipos({ ...tipos, [u.idUsuario]: e.target.value })}>{["USUARIO", "ADMINISTRADOR", "VETERINARIO"].map(t => <option key={t}>{t}</option>)}</select></td><td><button disabled={ocupado} onClick={() => salvar(u)}>Salvar</button></td></tr>)}</tbody></table></div></Painel>;
}
