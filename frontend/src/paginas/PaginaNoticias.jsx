import { useState } from "react";
import Painel from "../componentes/Painel";
import { useAutenticacao } from "../servicos/contextoAutenticacao";
import { useConsulta } from "../servicos/useConsulta";
import { api, requisicao } from "../servicos/api";
import "../css/PaginaNoticias.css";

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
            setAviso("Notícia salva com sucesso.");
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
            setAviso("Notícia excluída.");
        } catch (e) {
            setAviso(e.message);
        } finally {
            setOcupado(false);
        }
    }

    return (
        <Painel titulo="Notícias" erro={erro}>
            <section className="pagina-noticias">
                <header className="noticias-topo">
                    <div>
                        <span>ACONTECE NA ONG</span>
                        <h2>Histórias, resgates e novidades</h2>
                        <p>Acompanhe o dia a dia da ONG, ações realizadas e histórias dos nossos animais.</p>
                    </div>

                    {admin && (
                        <button
                            className="noticias-criar"
                            type="button"
                            onClick={() => {
                                setForm({ tituloNoticia: "", descricaoNoticia: "" });
                                setImagem(null);
                                setAviso("");
                            }}
                        >
                            + Criar notícia
                        </button>
                    )}
                </header>

                {aviso && <p className="noticias-aviso">{aviso}</p>}

                {admin && form && (
                    <form className="noticias-formulario" onSubmit={salvar}>
                        <div className="noticias-formulario-topo">
                            <div>
                                <span>{form.idNoticia ? "EDIÇÃO" : "NOVA PUBLICAÇÃO"}</span>
                                <h3>{form.idNoticia ? "Editar notícia" : "Publicar notícia"}</h3>
                            </div>
                            <button
                                className="noticias-fechar"
                                type="button"
                                onClick={() => {
                                    setForm(null);
                                    setImagem(null);
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <label>
                            Título
                            <input
                                required
                                maxLength={255}
                                placeholder="Digite o título da notícia"
                                value={form.tituloNoticia}
                                onChange={(e) => setForm({ ...form, tituloNoticia: e.target.value })}
                            />
                        </label>

                        <label>
                            Descrição
                            <textarea
                                required
                                maxLength={20000}
                                rows={7}
                                placeholder="Conte o que aconteceu..."
                                value={form.descricaoNoticia}
                                onChange={(e) => setForm({ ...form, descricaoNoticia: e.target.value })}
                            />
                        </label>

                        <label className="noticias-upload">
                            <span>Imagem da notícia</span>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(e) => setImagem(e.target.files?.[0] || null)}
                            />
                            <small>JPG, PNG ou WebP, até 5 MB.</small>
                        </label>

                        {form.imagemNoticia && !imagem && (
                            <div className="noticias-imagem-atual">
                                <span>Imagem atual</span>
                                <img
                                    src={enderecoImagem(form.imagemNoticia)}
                                    alt="Imagem atual da notícia"
                                />
                            </div>
                        )}

                        {imagem && <p className="noticias-arquivo">Nova imagem: <strong>{imagem.name}</strong></p>}

                        <div className="noticias-formulario-acoes">
                            <button disabled={ocupado}>{ocupado ? "Salvando..." : "Salvar notícia"}</button>
                            <button
                                className="secundario"
                                type="button"
                                onClick={() => {
                                    setForm(null);
                                    setImagem(null);
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                )}

                {!dados.length ? (
                    <div className="noticias-vazio">
                        <span>📰</span>
                        <h3>Nenhuma notícia publicada</h3>
                        <p>Quando houver novidades da ONG, elas aparecerão aqui.</p>
                    </div>
                ) : (
                    <div className="noticias-grade">
                        {dados.map((n) => (
                            <article className="noticia-card" key={n.idNoticia}>
                                <div className="noticia-card-imagem">
                                    {n.imagemNoticia ? (
                                        <img src={enderecoImagem(n.imagemNoticia)} alt={n.tituloNoticia} />
                                    ) : (
                                        <div className="noticia-card-sem-imagem">🐾</div>
                                    )}
                                    <time>{new Date(n.dataPublicacao).toLocaleDateString("pt-BR")}</time>
                                </div>

                                <div className="noticia-card-conteudo">
                                    <span className="noticia-card-etiqueta">NOTÍCIA</span>
                                    <h2>{n.tituloNoticia}</h2>
                                    <p>{n.descricaoNoticia}</p>

                                    {admin && (
                                        <div className="noticia-card-acoes">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setForm({ ...n });
                                                    setImagem(null);
                                                    setAviso("");
                                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                                }}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="noticia-excluir"
                                                type="button"
                                                disabled={ocupado}
                                                onClick={() => excluir(n.idNoticia)}
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </Painel>
    );
}
