import { API_URL } from "../servicos/api";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cabecalho from "../cabecalhos/CabecalhoPadrao";
import { api, requisicao } from "../servicos/api";
import { useAutenticacao } from "../servicos/contextoAutenticacao";
import "../css/Perfil.css";

export default function PaginaEditarPerfil() {
    const navigate = useNavigate();
    const { usuario, atualizarUsuario } = useAutenticacao();
    const [form, setForm] = useState({
        nomeUsuario: "",
        sobrenomeUsuario: "",
        emailUsuario: "",
        telefoneUsuario: "",
        regiaoUsuario: ""
    });
    const [imagem, setImagem] = useState(null);
    const [salvando, setSalvando] = useState(false);
    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        if (!usuario) return;

        setForm({
            nomeUsuario: usuario.nomeUsuario || "",
            sobrenomeUsuario: usuario.sobrenomeUsuario || "",
            emailUsuario: usuario.emailUsuario || "",
            telefoneUsuario: usuario.telefoneUsuario || "",
            regiaoUsuario: usuario.regiaoUsuario || ""
        });
    }, [usuario]);

    const fotoAtual = usuario?.imagemPerfilUsuario
        ? `${API_URL}/uploads/perfis/${usuario.imagemPerfilUsuario}`
        : null;

    const previa = useMemo(() => {
        if (!imagem) return null;
        return URL.createObjectURL(imagem);
    }, [imagem]);

    useEffect(() => {
        return () => {
            if (previa) URL.revokeObjectURL(previa);
        };
    }, [previa]);

    function alterarCampo(evento) {
        setForm({
            ...form,
            [evento.target.name]: evento.target.value
        });
    }

    async function salvarDados(evento) {
        evento.preventDefault();
        setSalvando(true);
        setMensagem("");

        try {
            const atualizado = await api("/usuarios/me", "PUT", form);
            atualizarUsuario(atualizado);
            setMensagem("Dados pessoais atualizados com sucesso.");
        } catch (erro) {
            setMensagem(erro.message);
        } finally {
            setSalvando(false);
        }
    }

    async function salvarFoto() {
        if (!imagem) return;

        setSalvando(true);
        setMensagem("");

        try {
            const dados = new FormData();
            dados.append("imagem", imagem);

            const resposta = await requisicao("/usuarios/me/foto", {
                method: "POST",
                body: dados
            });

            if (!resposta.ok) {
                const erro = await resposta.json().catch(() => ({}));
                throw new Error(
                    erro.detail || erro.message || "Não foi possível atualizar a foto"
                );
            }

            const atualizado = await resposta.json();
            atualizarUsuario(atualizado);
            setImagem(null);
            setMensagem("Foto de perfil atualizada com sucesso.");
        } catch (erro) {
            setMensagem(erro.message);
        } finally {
            setSalvando(false);
        }
    }

    async function removerFoto() {
        if (!window.confirm("Remover sua foto de perfil?")) return;

        setSalvando(true);
        setMensagem("");

        try {
            const atualizado = await api("/usuarios/me/foto", "DELETE");
            atualizarUsuario(atualizado);
            setImagem(null);
            setMensagem("Foto removida.");
        } catch (erro) {
            setMensagem(erro.message);
        } finally {
            setSalvando(false);
        }
    }

    return (
        <>
            <Cabecalho />

            <main className="pagina-perfil-edicao">
                <button
                    className="voltar-perfil"
                    type="button"
                    onClick={() => navigate("/AmbienteUsuario")}
                >
                    ← Voltar ao perfil
                </button>

                <div className="perfil-edicao-grid">
                    <section className="cartao-foto-perfil">
                        <div className="foto-perfil-grande">
                            {previa || fotoAtual ? (
                                <img
                                    src={previa || fotoAtual}
                                    alt="Foto de perfil"
                                />
                            ) : (
                                <span>
                                    {usuario?.nomeUsuario?.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>

                        <h2>Foto de perfil</h2>
                        <p>JPG, PNG ou WebP de até 5 MB.</p>

                        <label className="seletor-foto">
                            Escolher imagem
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(evento) =>
                                    setImagem(evento.target.files?.[0] || null)
                                }
                            />
                        </label>

                        {imagem && (
                            <button
                                type="button"
                                onClick={salvarFoto}
                                disabled={salvando}
                            >
                                Salvar nova foto
                            </button>
                        )}

                        {usuario?.imagemPerfilUsuario && (
                            <button
                                className="botao-remover-foto"
                                type="button"
                                onClick={removerFoto}
                                disabled={salvando}
                            >
                                Remover foto
                            </button>
                        )}
                    </section>

                    <section className="cartao-dados-perfil">
                        <div className="titulo-edicao-perfil">
                            <div>
                                <span>Minha conta</span>
                                <h1>Editar perfil</h1>
                            </div>

                            <button
                                type="button"
                                onClick={() => navigate("/Configuracoes")}
                            >
                                Configurações
                            </button>
                        </div>

                        <form onSubmit={salvarDados}>
                            <div className="campos-perfil-duplos">
                                <label>
                                    Nome
                                    <input
                                        name="nomeUsuario"
                                        value={form.nomeUsuario}
                                        onChange={alterarCampo}
                                        required
                                    />
                                </label>

                                <label>
                                    Sobrenome
                                    <input
                                        name="sobrenomeUsuario"
                                        value={form.sobrenomeUsuario}
                                        onChange={alterarCampo}
                                    />
                                </label>
                            </div>

                            <label>
                                E-mail
                                <input
                                    type="email"
                                    name="emailUsuario"
                                    value={form.emailUsuario}
                                    onChange={alterarCampo}
                                    required
                                />
                            </label>

                            <label>
                                Telefone
                                <input
                                    name="telefoneUsuario"
                                    value={form.telefoneUsuario}
                                    onChange={alterarCampo}
                                    placeholder="Ex: (67) 99999-9999"
                                />
                            </label>

                            <label>
                                Região
                                <input
                                    name="regiaoUsuario"
                                    value={form.regiaoUsuario}
                                    onChange={alterarCampo}
                                    placeholder="Ex: Dourados - MS"
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
                                {salvando ? "Salvando..." : "Salvar alterações"}
                            </button>
                        </form>
                    </section>
                </div>
            </main>
        </>
    );
}
