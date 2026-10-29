import { API_URL } from "../servicos/api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Painel from "../componentes/Painel";
import ImgExemplo from "../assets/ImgExemplo.png";
import { useConsulta } from "../servicos/useConsulta";
import { api } from "../servicos/api";

const nomesStatus = {
    RESGATADO: "Resgatado",
    EM_TRATAMENTO: "Em tratamento",
    DISPONIVEL: "Disponível",
    ADOTADO: "Adotado"
};

function opcoesStatus(status) {
    if (status === "RESGATADO") return ["RESGATADO", "EM_TRATAMENTO"];
    if (status === "EM_TRATAMENTO") return ["EM_TRATAMENTO", "DISPONIVEL"];
    return [status];
}

function imagemAnimal(animal) {
    return animal.imagemAnimal
        ? `${API_URL}/uploads/animais/${animal.imagemAnimal}`
        : ImgExemplo;
}

export default function PaginaVeterinario() {
    const { dados: animais, erro: erroAnimais, atualizar: atualizarAnimais } = useConsulta("/animais");
    const { dados: racoes, erro: erroRacoes, atualizar: atualizarRacoes } = useConsulta("/estoque/racoes");
    const [edicao, setEdicao] = useState(null);
    const [filtroStatus, setFiltroStatus] = useState("TODOS");
    const [consumos, setConsumos] = useState({});
    const [aviso, setAviso] = useState("");
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        setConsumos((atuais) => {
            const novos = { ...atuais };
            racoes.forEach((racao) => {
                if (!(racao.id in novos)) {
                    novos[racao.id] = String(racao.consumoRecomendado ?? "");
                }
            });
            return novos;
        });
    }, [racoes]);

    const resgatados = animais.filter((animal) => animal.statusAnimal === "RESGATADO");
    const emTratamento = animais.filter((animal) => animal.statusAnimal === "EM_TRATAMENTO");

    async function salvar(event) {
        event.preventDefault();
        setSalvando(true);
        setAviso("");

        try {
            await api(`/animais/${edicao.idAnimal}/veterinario`, "PATCH", {
                estadoSaudeAnimal: edicao.estadoSaudeAnimal,
                castracaoAnimal: edicao.castracaoAnimal,
                tratamentoAnimal: edicao.tratamentoAnimal,
                vacinacaoAnimal: edicao.vacinacaoAnimal,
                statusAnimal: edicao.statusAnimal
            });

            setEdicao(null);
            await atualizarAnimais();
            setAviso("Informações veterinárias atualizadas.");
        } catch (erro) {
            setAviso(erro.message);
        } finally {
            setSalvando(false);
        }
    }

    async function salvarConsumo(racao) {
        const valor = Number(consumos[racao.id]);

        if (!Number.isFinite(valor) || valor <= 0) {
            setAviso("Informe um consumo recomendado maior que zero.");
            return;
        }

        setSalvando(true);
        setAviso("");

        try {
            await api(`/estoque/racoes/${racao.id}/consumo`, "PATCH", {
                consumoRecomendado: valor
            });

            await atualizarRacoes();
            setAviso(`Consumo recomendado de ${racao.nome} atualizado.`);
        } catch (erro) {
            setAviso(erro.message);
        } finally {
            setSalvando(false);
        }
    }

    function cardAnimal(animal) {
        return (
            <article className="card-veterinario" key={animal.idAnimal}>
                <img
                    className="card-veterinario-imagem"
                    src={imagemAnimal(animal)}
                    alt={`Imagem de ${animal.nomeAnimal}`}
                />

                <div className="card-veterinario-conteudo">
                    <span className="card-veterinario-id">ID #{animal.idAnimal}</span>
                    <h3>{animal.nomeAnimal}</h3>
                    <p>{animal.tipoAnimal} · {animal.pesoAnimal} kg</p>
                    <p><strong>Status:</strong> {nomesStatus[animal.statusAnimal] || animal.statusAnimal}</p>
                    <p><strong>Saúde:</strong> {animal.estadoSaudeAnimal || "Não informado"}</p>

                    <div className="acoes-veterinario">
                        <Link to={`/DetalhesAnimais/${animal.idAnimal}`}>Ver animal</Link>
                        <button type="button" onClick={() => setEdicao({ ...animal })}>
                            Editar prontuário
                        </button>
                    </div>
                </div>
            </article>
        );
    }

    function listaAnimais(titulo, descricao, lista) {
        return (
            <section className="secao-veterinario">
                <div className="secao-veterinario-titulo">
                    <div>
                        <h2>{titulo}</h2>
                        <p>{descricao}</p>
                    </div>
                    <span>{lista.length}</span>
                </div>

                {lista.length === 0 ? (
                    <p className="estado-veterinario-vazio">Nenhum animal nesta lista.</p>
                ) : (
                    <div className="grade-veterinario">
                        {lista.map(cardAnimal)}
                    </div>
                )}
            </section>
        );
    }

    return (
        <Painel titulo="Atendimento veterinário" erro={erroAnimais || erroRacoes || aviso}>
            <section className="filtro-veterinario">
                <label>
                    Filtrar animais
                    <select value={filtroStatus} onChange={(event) => setFiltroStatus(event.target.value)}>
                        <option value="TODOS">Resgatados e em tratamento</option>
                        <option value="RESGATADO">Somente resgatados</option>
                        <option value="EM_TRATAMENTO">Somente em tratamento</option>
                    </select>
                </label>
            </section>

            {edicao && (
                <form className="form-veterinario" onSubmit={salvar}>
                    <div className="form-veterinario-topo">
                        <div>
                            <span>ID #{edicao.idAnimal}</span>
                            <h2>{edicao.nomeAnimal}</h2>
                        </div>
                        <button type="button" className="secundario" onClick={() => setEdicao(null)}>
                            Fechar
                        </button>
                    </div>

                    <div className="form-veterinario-grade">
                        <label>
                            Status
                            <select
                                value={edicao.statusAnimal}
                                onChange={(event) => setEdicao({ ...edicao, statusAnimal: event.target.value })}
                            >
                                {opcoesStatus(edicao.statusAnimal).map((status) => (
                                    <option key={status} value={status}>
                                        {nomesStatus[status]}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Castração
                            <select
                                value={String(!!edicao.castracaoAnimal)}
                                onChange={(event) => setEdicao({ ...edicao, castracaoAnimal: event.target.value === "true" })}
                            >
                                <option value="true">Sim</option>
                                <option value="false">Não</option>
                            </select>
                        </label>
                    </div>

                    <label>
                        Estado de saúde
                        <textarea
                            maxLength={255}
                            value={edicao.estadoSaudeAnimal || ""}
                            onChange={(event) => setEdicao({ ...edicao, estadoSaudeAnimal: event.target.value })}
                        />
                    </label>

                    <label>
                        Tratamento
                        <textarea
                            maxLength={4000}
                            value={edicao.tratamentoAnimal || ""}
                            onChange={(event) => setEdicao({ ...edicao, tratamentoAnimal: event.target.value })}
                        />
                    </label>

                    <label>
                        Vacinação
                        <textarea
                            maxLength={4000}
                            value={edicao.vacinacaoAnimal || ""}
                            onChange={(event) => setEdicao({ ...edicao, vacinacaoAnimal: event.target.value })}
                        />
                    </label>

                    <div className="acoes-veterinario-form">
                        <button disabled={salvando}>Salvar alterações</button>
                        <button type="button" className="secundario" onClick={() => setEdicao(null)}>
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            {(filtroStatus === "TODOS" || filtroStatus === "RESGATADO") &&
                listaAnimais(
                    "Animais resgatados",
                    "Animais que chegaram à ONG e aguardam avaliação ou início do tratamento.",
                    resgatados
                )}

            {(filtroStatus === "TODOS" || filtroStatus === "EM_TRATAMENTO") &&
                listaAnimais(
                    "Animais em tratamento",
                    "Animais que ainda estão recebendo acompanhamento veterinário.",
                    emTratamento
                )}

            <section className="secao-veterinario racoes-veterinario">
                <div className="secao-veterinario-titulo">
                    <div>
                        <h2>Consumo recomendado das rações</h2>
                        <p>Altere a recomendação em gramas por kg corporal por dia.</p>
                    </div>
                    <span>{racoes.length}</span>
                </div>

                {racoes.length === 0 ? (
                    <p className="estado-veterinario-vazio">Nenhuma ração cadastrada.</p>
                ) : (
                    <div className="tabela-racoes-veterinario">
                        {racoes.map((racao) => (
                            <article key={racao.id} className="racao-veterinario-item">
                                <div>
                                    <strong>{racao.nome}</strong>
                                    <span>
                                        {racao.marca || "Sem marca"} · {racao.especieIndicada || "Espécie não informada"}
                                    </span>
                                </div>

                                <label>
                                    g/kg/dia
                                    <input
                                        type="number"
                                        min="0.00000001"
                                        step="0.01"
                                        value={consumos[racao.id] ?? ""}
                                        onChange={(event) => setConsumos({ ...consumos, [racao.id]: event.target.value })}
                                    />
                                </label>

                                <button type="button" disabled={salvando} onClick={() => salvarConsumo(racao)}>
                                    Atualizar
                                </button>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </Painel>
    );
}
