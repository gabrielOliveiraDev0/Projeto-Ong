import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cabecalho from "../cabecalhos/CabecalhoPadrao";
import { api } from "../servicos/api";
import "../css/Perfil.css";

export default function PaginaConfiguracoes() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        senhaAtual: "",
        novaSenha: "",
        confirmarSenha: ""
    });
    const [mensagem, setMensagem] = useState("");
    const [salvando, setSalvando] = useState(false);

    function alterar(evento) {
        setForm({
            ...form,
            [evento.target.name]: evento.target.value
        });
    }

    async function salvar(evento) {
        evento.preventDefault();
        setMensagem("");

        if (form.novaSenha !== form.confirmarSenha) {
            setMensagem("A confirmação da nova senha não confere.");
            return;
        }

        setSalvando(true);

        try {
            await api("/usuarios/me/senha", "PATCH", {
                senhaAtual: form.senhaAtual,
                novaSenha: form.novaSenha
            });

            setForm({
                senhaAtual: "",
                novaSenha: "",
                confirmarSenha: ""
            });
            setMensagem("Senha alterada com sucesso.");
        } catch (erro) {
            setMensagem(erro.message);
        } finally {
            setSalvando(false);
        }
    }

    return (
        <>
            <Cabecalho />

            <main className="pagina-configuracoes">
                <button
                    className="voltar-perfil"
                    type="button"
                    onClick={() => navigate("/AmbienteUsuario")}
                >
                    ← Voltar ao perfil
                </button>

                <section className="cartao-configuracoes">
                    <span>Configurações</span>
                    <h1>Segurança da conta</h1>
                    <p>
                        Altere sua senha de acesso. A senha atual é necessária para confirmar a mudança.
                    </p>

                    <form onSubmit={salvar}>
                        <label>
                            Senha atual
                            <input
                                type="password"
                                name="senhaAtual"
                                value={form.senhaAtual}
                                onChange={alterar}
                                required
                            />
                        </label>

                        <label>
                            Nova senha
                            <input
                                type="password"
                                name="novaSenha"
                                minLength={6}
                                value={form.novaSenha}
                                onChange={alterar}
                                required
                            />
                        </label>

                        <label>
                            Confirmar nova senha
                            <input
                                type="password"
                                name="confirmarSenha"
                                minLength={6}
                                value={form.confirmarSenha}
                                onChange={alterar}
                                required
                            />
                        </label>

                        {mensagem && (
                            <p className="mensagem-perfil">{mensagem}</p>
                        )}

                        <button
                            className="salvar-perfil"
                            type="submit"
                            disabled={salvando}
                        >
                            {salvando ? "Alterando..." : "Alterar senha"}
                        </button>
                    </form>
                </section>
            </main>
        </>
    );
}
