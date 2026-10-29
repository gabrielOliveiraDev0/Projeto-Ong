import { useState } from "react";
import Painel from "../componentes/Painel";
import { useAutenticacao } from "../servicos/contextoAutenticacao";
import { useConsulta } from "../servicos/useConsulta";
import { api, requisicao } from "../servicos/api";

export default function PaginaNoticias() {
    const { usuario } = useAutenticacao();
    const { dados, erro, atualizar } = useConsulta("/noticias");
    const [form, setForm] = useState(null);
    const [imagem, setImagem] = useState(null);
    const [aviso, setAviso] = useState("");
    const [ocupado, setOcupado] = useState(false);
    const admin = usuario?.tipoUsuario === "ADMINISTRADOR";

    function enderecoImagem(nome) {
        return nome ? `http://localhost:8080/uploads/noticias/${nome}` : null;
    }

    async function salvar(e) {
        e.preventDefault();
        setOcupado(true);
        setAviso("");

        try {
            const noticia = await api(
                form.idNoticia ? `/noticias/${form.idNoticia}` : "/noticias",
                form.idNoticia ? "PUT" : "POST",
                {
                    tituloNoticia: form.tituloNoticia,
                    descricaoNoticia: form.descricaoNoticia
                }
            );

            if (imagem) {
                const dadosImagem = new FormData();
                dadosImagem.append("imagem", imagem);

                const resposta = await requisicao(`/noticias/${noticia.idNoticia}/imagem`, {
                    method: "POST",
                    body: dadosImagem
                });

                if (!resposta.ok) {
                    const falha = await resposta.json().catch(() => ({}));
                    throw new Error(falha.detail || falha.message || "Não foi possível enviar a imagem");
                }
            }

            setForm(null);
            setImagem(null);
            await atualizar();
            setAviso("Notícia salva.");
        } catch (e) {
            setAviso(e.message);
        } finally {
            setOcupado(false);
        }
    }

    async function excluir(id) {
        if (!window.confirm("Excluir esta notícia?")) return;
        setOcupado(true);

        try {
            await api(`/noticias/${id}`, "DELETE");
            await atualizar();
        } catch (e) {
            setAviso(e.message);
        } finally {
            setOcupado(false);
        }
    }

    return (
        <Painel titulo="Notícias" erro={erro || aviso}>
            {admin && (
                <button
                    type="button"
                    onClick={() => {
                        setForm({ tituloNoticia: "", descricaoNoticia: "" });
                        setImagem(null);
                    }}
                >
                    Criar notícia
                </button>
            )}

            {admin && form && (
                <form onSubmit={salvar}>
                    <label>
                        Título
                        <input
                            required
                            maxLength={255}
                            value={form.tituloNoticia}
                            onChange={e => setForm({ ...form, tituloNoticia: e.target.value })}
                        />
                    </label>

                    <label>
                        Descrição
                        <textarea
                            required
                            maxLength={20000}
                            value={form.descricaoNoticia}
                            onChange={e => setForm({ ...form, descricaoNoticia: e.target.value })}
                        />
                    </label>

                    <label>
                        Imagem
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={e => setImagem(e.target.files?.[0] || null)}
                        />
                    </label>

                    {form.imagemNoticia && !imagem && (
                        <img
                            className="noticia-imagem"
                            src={enderecoImagem(form.imagemNoticia)}
                            alt="Imagem atual da notícia"
                        />
                    )}

                    {imagem && <p>Nova imagem: {imagem.name}</p>}

                    <button disabled={ocupado}>Salvar</button>
                    <button
                        type="button"
                        onClick={() => {
                            setForm(null);
                            setImagem(null);
                        }}
                    >
                        Cancelar
                    </button>
                </form>
            )}

            {!dados.length && <p>Nenhuma notícia publicada.</p>}

            {dados.map(n => (
                <article key={n.idNoticia}>
                    <h2>{n.tituloNoticia}</h2>
                    <time>{new Date(n.dataPublicacao).toLocaleString("pt-BR")}</time>

                    {n.imagemNoticia && (
                        <div>
                            <img
                                className="noticia-imagem"
                                src={enderecoImagem(n.imagemNoticia)}
                                alt={n.tituloNoticia}
                            />
                        </div>
                    )}

                    <p style={{ whiteSpace: "pre-wrap" }}>{n.descricaoNoticia}</p>

                    {admin && (
                        <>
                            <button
                                type="button"
                                onClick={() => {
                                    setForm({ ...n });
                                    setImagem(null);
                                }}
                            >
                                Editar
                            </button>
                            <button
                                type="button"
                                disabled={ocupado}
                                onClick={() => excluir(n.idNoticia)}
                            >
                                Excluir
                            </button>
                        </>
                    )}
                </article>
            ))}
        </Painel>
    );
}
