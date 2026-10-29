import { useEffect, useRef, useState } from "react";
import Painel from "../componentes/Painel";
import MenuRelatorios from "../componentes/MenuRelatorios";
import { requisicao } from "../servicos/api";
import { dinheiro, numero } from "../servicos/formatacao";
import "../css/RelatorioMensal.css";

const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const dataLocal = valor => new Date(valor).toLocaleString("pt-BR", { timeZone: "America/Campo_Grande" });

function Indicadores({ itens }) {
    return <dl className="mensal-indicadores">{itens.map(([nome, valor]) => <div key={nome}><dt>{nome}</dt><dd>{valor}</dd></div>)}</dl>;
}
function Secao({ titulo, children }) {
    return <section className="relatorio-bloco"><h2>{titulo}</h2>{children}</section>;
}

export default function PaginaRelatorioMensal() {
    const [filtro, setFiltro] = useState(() => {
        const partes = new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Campo_Grande", month: "numeric", year: "numeric" }).formatToParts(new Date());
        return { mes: partes.find(p => p.type === "month").value, ano: partes.find(p => p.type === "year").value };
    });
    const [relatorio, setRelatorio] = useState(null);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");
    const requisicaoAtual = useRef(null);
    useEffect(() => () => { requisicaoAtual.current?.abort(); }, []);

    function alterar(campo, valor) {
        requisicaoAtual.current?.abort();
        requisicaoAtual.current = null;
        setFiltro(atual => ({ ...atual, [campo]: valor }));
        setRelatorio(null);
        setErro("");
        setCarregando(false);
    }

    async function gerar(evento) {
        evento.preventDefault();
        requisicaoAtual.current?.abort();
        const controle = new AbortController();
        requisicaoAtual.current = controle;
        setCarregando(true);
        setErro("");
        setRelatorio(null);
        try {
            const resposta = await requisicao(`/relatorios/mensal?${new URLSearchParams(filtro)}`, { signal: controle.signal });
            const dados = await resposta.json().catch(() => null);
            if (!resposta.ok) throw new Error(dados?.message || dados?.detail || `Não foi possível gerar o relatório (${resposta.status}).`);
            if (!dados) throw new Error("O servidor retornou uma resposta vazia.");
            if (requisicaoAtual.current === controle) setRelatorio(dados);
        } catch (e) {
            if (e.name !== "AbortError" && requisicaoAtual.current === controle) setErro(e.message);
        } finally {
            if (requisicaoAtual.current === controle) setCarregando(false);
        }
    }

    const r = relatorio;
    return <Painel titulo="Relatório mensal" erro={erro}>
        <div className="relatorio-mensal">
            <MenuRelatorios />
            <form className="mensal-filtro" onSubmit={gerar}>
                <label>Mês<select value={Number(filtro.mes)} onChange={e => alterar("mes", e.target.value)}>{meses.map((mes, i) => <option key={mes} value={i + 1}>{mes}</option>)}</select></label>
                <label>Ano<input required type="number" min="1" max="9999" step="1" value={filtro.ano} onChange={e => alterar("ano", e.target.value)} /></label>
                <button disabled={carregando} type="submit">{carregando ? "Gerando..." : "Gerar relatório"}</button>
                <button disabled={!r || carregando} type="button" onClick={() => window.print()}>Imprimir / Salvar em PDF</button>
            </form>
            {carregando && <p role="status">Consultando as atividades do período...</p>}
            {!r && !carregando && !erro && <p className="mensal-instrucao">Selecione o mês e o ano e clique em Gerar relatório.</p>}
            {r && <div className="mensal-conteudo">
                <header className="mensal-cabecalho"><h2>{meses[r.mes - 1]} de {r.ano}</h2><p>Gerado em {dataLocal(r.geradoEm)}</p><p>Período: {dataLocal(r.inicio)} até {dataLocal(r.fimExclusivo)} (fim exclusivo).</p></header>
                <section aria-label="Resumo" className="relatorio-cards">
                    {[["Entradas de animais", r.animais.entradas], ["Animais adotados no mês", r.animais.adotadosNoMes], ["Ração consumida registrada", `${numero(r.racao.consumidoKg)} kg`], ["Novos usuários", r.usuarios.novos]].map(([nome, valor]) => <article key={nome}><span>{nome}</span><strong>{valor}</strong></article>)}
                </section>
                <Secao titulo="Animais">
                    <Indicadores itens={[["Entradas no mês", r.animais.entradas], ["Saídas no mês", r.animais.saidas], ["Saldo de movimentação", r.animais.saldoMovimentacao], ["Adotados no mês", r.animais.adotadosNoMes]]} />
                    <h3>Quantidade atual por status</h3><Indicadores itens={[["Resgatados", r.animais.resgatados], ["Em tratamento", r.animais.emTratamento], ["Disponíveis", r.animais.disponiveis], ["Adotados", r.animais.adotados]]} />
                </Secao>
                <Secao titulo="Adoções">
                    <Indicadores itens={[["Solicitações criadas no mês", r.adocoes.solicitacoes], ["Aprovações decididas no mês", r.adocoes.aprovadas], ["Recusas decididas no mês", r.adocoes.recusadas], ["Criadas no mês e pendentes ao fim do período", r.adocoes.pendentes]]} />
                    <p>Decisões podem se referir a solicitações de meses anteriores; por isso, os números não precisam somar o total de novas solicitações.</p>
                </Secao>
                <Secao titulo="Estoque">
                    <Indicadores itens={[["Movimentações de entrada", r.estoque.entradas], ["Saídas manuais", r.estoque.saidas], ["Saídas automáticas", r.estoque.saidasAutomaticas], ["Total de movimentações", r.estoque.movimentacoes], ["Valor das entradas", dinheiro(r.estoque.valorEntradas)], ["Valor das saídas (manuais + automáticas)", dinheiro(r.estoque.valorSaidas)]]} />
                </Secao>
                <Secao titulo="Ração">
                    <Indicadores itens={[["Consumo registrado no mês", `${numero(r.racao.consumidoKg)} kg`], [`Média diária (${r.diasDoMes} dias)`, `${numero(r.racao.mediaDiariaKg)} kg/dia`], ["Estoque atual", `${numero(r.racao.estoqueAtualKg)} kg`], ["Baixas automáticas de ração", r.racao.baixasAutomaticas]]} />
                    {r.racao.porRacao.length ? <div className="rolagem"><table><caption>Consumo registrado por ração</caption><thead><tr><th scope="col">Ração</th><th scope="col">Quantidade (kg)</th></tr></thead><tbody>{r.racao.porRacao.map(item => <tr key={item.id}><td>{item.nome}</td><td>{numero(item.consumidoKg)}</td></tr>)}</tbody></table></div> : <p>Nenhuma baixa automática de ração registrada neste período.</p>}
                </Secao>
                <Secao titulo="Usuários"><p>Novos cadastros do mês, agrupados pelo perfil atual.</p><Indicadores itens={[["Novos usuários", r.usuarios.novos], ["Usuário", r.usuarios.usuarios], ["Veterinário", r.usuarios.veterinarios], ["Administrador", r.usuarios.administradores]]} /></Secao>
                <Secao titulo="Notícias"><p>{r.noticias.quantidade} publicações no período.</p>{r.noticias.publicacoes.length > 0 && <div className="rolagem"><table><thead><tr><th scope="col">Data</th><th scope="col">Título</th></tr></thead><tbody>{r.noticias.publicacoes.map(n => <tr key={n.id}><td>{dataLocal(n.data)}</td><td>{n.titulo}</td></tr>)}</tbody></table></div>}</Secao>
                <Secao titulo="Chat"><Indicadores itens={[["Novas conversas", r.chat.novasConversas], ["Mensagens enviadas", r.chat.mensagens]]} /></Secao>
                <section className="mensal-notas"><h2>Critérios e cobertura dos dados</h2><ul>{r.observacoes.map(nota => <li key={nota}>{nota}</li>)}</ul></section>
            </div>}
        </div>
    </Painel>;
}
