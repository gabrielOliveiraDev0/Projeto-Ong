import MenuRelatorios from "../componentes/MenuRelatorios";
import { Link } from "react-router-dom";
import Painel from "../componentes/Painel";
import { useConsulta } from "../servicos/useConsulta";
import { categorias, dinheiro, numero } from "../servicos/formatacao";

export default function PaginaRelatorios() {
    const { dados: r, erro } = useConsulta("/estoque/relatorios", null);

    if (!r) {
        return (
            <Painel titulo="Relatórios financeiros" erro={erro}>
                <MenuRelatorios />
                <p>{erro ? "Não foi possível carregar a visão geral." : "Carregando..."}</p>
            </Painel>
        );
    }

    const totalEstoque = Math.max(1, Number(r.valorTotal));
    const totalConsumoGramas = Math.max(1, Number(r.consumoKgDia) * 1000);
    const racoes = r.itens.filter((item) => item.item.categoria === "RACAO");

    const cards = [
        ["Estoque de ração", `${numero(r.racaoKg)} kg`],
        ["Consumo diário", `${numero(r.consumoKgDia)} kg/dia`],
        ["Valor do estoque", dinheiro(r.valorTotal)],
        ["Entradas acumuladas", dinheiro(r.entradasValor)],
        ["Saídas acumuladas", dinheiro(r.saidasValor)]
    ];

    return (
        <Painel titulo="Relatórios financeiros" erro={erro}>
            <MenuRelatorios />
            <div className="acoes relatorio-acoes">
                <Link to="/RelatorioAnimais">Relatório de animais</Link>
                <Link to="/Estoque">Voltar ao estoque</Link>
            </div>

            <div className="relatorio-cards">
                {cards.map(([titulo, valor]) => (
                    <article key={titulo}>
                        <span>{titulo}</span>
                        <strong>{valor}</strong>
                    </article>
                ))}
            </div>

            <section className="relatorio-bloco" id="relatorio-estoque">
                <div className="relatorio-bloco-titulo">
                    <div>
                        <h2>Valor atual por categoria</h2>
                        <p>Cada barra representa a participação da categoria no valor total atual do estoque.</p>
                    </div>
                    <strong>{dinheiro(r.valorTotal)}</strong>
                </div>

                <div className="grafico grafico-relatorio" role="img" aria-label="Gráfico de barras: participação das categorias no valor total do estoque">
                    {Object.entries(r.porCategoria).map(([categoria, valor]) => {
                        const percentual = Number(valor) / totalEstoque * 100;

                        return (
                            <article key={categoria}>
                                <div className="grafico-linha-cabecalho">
                                    <span>{categorias[categoria]}</span>
                                    <strong>{dinheiro(valor)} · {numero(percentual)}%</strong>
                                </div>
                                <div className="barra-trilho">
                                    <div className="barra" style={{ width: `${Math.min(100, percentual)}%` }} />
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>

            <section className="relatorio-bloco">
                <div className="relatorio-bloco-titulo">
                    <div>
                        <h2>Consumo diário de ração</h2>
                        <p>Distribuição do consumo diário entre as rações atualmente vinculadas aos animais.</p>
                    </div>
                    <strong>{numero(r.consumoKgDia)} kg/dia</strong>
                </div>

                <div className="grafico grafico-relatorio" role="img" aria-label="Gráfico de barras: consumo diário por ração">
                    {racoes.map((racao) => {
                        const consumo = Number(racao.consumoDiario || 0);
                        const percentual = consumo / totalConsumoGramas * 100;

                        return (
                            <article key={racao.item.id}>
                                <div className="grafico-linha-cabecalho">
                                    <span>{racao.item.nome}</span>
                                    <strong>{numero(consumo)} g/dia · {racao.quantidadeAnimais} animais</strong>
                                </div>
                                <div className="barra-trilho">
                                    <div className="barra barra-consumo" style={{ width: `${Math.min(100, percentual)}%` }} />
                                </div>
                            </article>
                        );
                    })}
                    {!racoes.length && <p>Nenhuma ração cadastrada.</p>}
                </div>
            </section>

            <section className="relatorio-bloco">
                <div className="relatorio-bloco-titulo">
                    <div>
                        <h2>Autonomia por ração</h2>
                        <p>Estimativa baseada no estoque atual e no consumo diário dos animais vinculados.</p>
                    </div>
                </div>

                <div className="rolagem">
                    <table>
                        <thead>
                            <tr>
                                <th>Ração</th>
                                <th>Estoque</th>
                                <th>Consumo diário</th>
                                <th>Animais</th>
                                <th>Autonomia</th>
                                <th>Previsão de término</th>
                            </tr>
                        </thead>
                        <tbody>
                            {racoes.map((item) => (
                                <tr key={item.item.id}>
                                    <td>{item.item.nome}</td>
                                    <td>{numero(item.item.quantidade)} {item.item.unidade}</td>
                                    <td>{numero(item.consumoDiario)} g/dia</td>
                                    <td>{item.quantidadeAnimais}</td>
                                    <td>{item.autonomiaDias === null ? "Sem consumo atual" : `${numero(item.autonomiaDias)} dias`}</td>
                                    <td>{item.previsaoFim || "—"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </Painel>
    );
}
