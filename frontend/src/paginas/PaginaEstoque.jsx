import { useState } from "react";
import { Link } from "react-router-dom";
import Painel from "../componentes/Painel";
import { api } from "../servicos/api";
import { useConsulta } from "../servicos/useConsulta";
import { categorias, dinheiro, numero } from "../servicos/formatacao";

const novo = {
    nome: "",
    categoria: "RACAO",
    quantidade: "0",
    unidade: "KG",
    valorUnitario: "0",
    fornecedor: "",
    dataEntrada: "",
    validade: "",
    estoqueMinimo: "0",
    marca: "",
    especieIndicada: "Cachorro",
    consumoRecomendado: "12"
};

export default function PaginaEstoque() {
    const { dados, erro, atualizar } = useConsulta("/estoque");
    const { dados: animais } = useConsulta("/animais");
    const { dados: historico, atualizar: atualizarHistorico } = useConsulta("/estoque/movimentacoes");
    const [form, setForm] = useState(null);
    const [mov, setMov] = useState(null);
    const [racao, setRacao] = useState(null);
    const [selecionados, setSelecionados] = useState([]);
    const [aviso, setAviso] = useState("");
    const [ocupado, setOcupado] = useState(false);

    const valorTotal = dados.reduce((total, registro) => total + Number(registro.valorTotal || 0), 0);
    const itensBaixos = dados.filter((registro) => registro.estoqueBaixo).length;
    const racoes = dados.filter((registro) => registro.item.categoria === "RACAO");
    const racaoKg = racoes.reduce((total, registro) => {
        const quantidade = Number(registro.item.quantidade || 0);
        return total + (registro.item.unidade === "KG" ? quantidade : quantidade / 1000);
    }, 0);

    async function executar(fn) {
        setOcupado(true);
        setAviso("");

        try {
            await fn();
            await Promise.all([atualizar(), atualizarHistorico()]);
            setAviso("Operação concluída.");
        } catch (erroExecucao) {
            setAviso(erroExecucao.message);
        } finally {
            setOcupado(false);
        }
    }

    function campo(nome, label, tipo = "text", obrigatorio = false) {
        return (
            <label key={nome}>
                {label}
                <input
                    required={obrigatorio}
                    type={tipo}
                    min={tipo === "number" ? "0" : undefined}
                    step={tipo === "number" ? "any" : undefined}
                    maxLength={255}
                    value={form[nome] ?? ""}
                    disabled={nome === "quantidade" && !!form.id}
                    onChange={(event) => setForm({ ...form, [nome]: event.target.value })}
                />
            </label>
        );
    }

    function salvar(event) {
        event.preventDefault();
        executar(async () => {
            await api(form.id ? `/estoque/${form.id}` : "/estoque", form.id ? "PUT" : "POST", {
                ...form,
                dataEntrada: form.dataEntrada || null,
                validade: form.validade || null,
                consumoRecomendado: form.categoria === "RACAO" ? form.consumoRecomendado : null
            });
            setForm(null);
        });
    }

    return (
        <Painel titulo="Estoque e alimentação" erro={erro || aviso}>
            <div className="estoque-acoes-topo">
                <button type="button" onClick={() => setForm({ ...novo })}>+ Cadastrar item</button>
                <Link to="/Relatorios">Relatórios financeiros</Link>
                <Link to="/RelatorioAnimais">Relatório de animais</Link>
            </div>

            <div className="estoque-resumo">
                <article>
                    <span>Itens cadastrados</span>
                    <strong>{dados.length}</strong>
                </article>
                <article>
                    <span>Valor atual</span>
                    <strong>{dinheiro(valorTotal)}</strong>
                </article>
                <article>
                    <span>Ração disponível</span>
                    <strong>{numero(racaoKg)} kg</strong>
                </article>
                <article className={itensBaixos ? "estoque-resumo-alerta" : ""}>
                    <span>Estoque baixo</span>
                    <strong>{itensBaixos}</strong>
                </article>
            </div>

            {form && (
                <form className="estoque-formulario" onSubmit={salvar}>
                    <div className="estoque-formulario-topo">
                        <div>
                            <span>{form.id ? `ID #${form.id}` : "Novo item"}</span>
                            <h2>{form.id ? "Editar item" : "Cadastrar item"}</h2>
                        </div>
                        <button type="button" className="secundario" onClick={() => setForm(null)}>Fechar</button>
                    </div>

                    <div className="estoque-form-grade">
                        {campo("nome", "Nome", "text", true)}
                        <label>
                            Categoria
                            <select disabled={!!form.id} value={form.categoria} onChange={(event) => setForm({ ...form, categoria: event.target.value })}>
                                {Object.entries(categorias).map(([valor, label]) => <option key={valor} value={valor}>{label}</option>)}
                            </select>
                        </label>
                        {campo("quantidade", "Quantidade inicial", "number", true)}
                        <label>
                            Unidade
                            <select disabled={!!form.id} value={form.unidade} onChange={(event) => setForm({ ...form, unidade: event.target.value })}>
                                {(form.categoria === "RACAO" ? ["KG", "G"] : ["KG", "G", "UN", "L", "ML"]).map((unidade) => <option key={unidade}>{unidade}</option>)}
                            </select>
                        </label>
                        {campo("valorUnitario", "Valor por unidade (R$)", "number", true)}
                        {campo("estoqueMinimo", "Estoque mínimo", "number", true)}
                        {campo("fornecedor", "Fornecedor")}
                        {campo("dataEntrada", "Data de entrada", "date")}
                        {campo("validade", "Validade", "date")}

                        {form.categoria === "RACAO" && <>
                            {campo("marca", "Marca")}
                            <label>
                                Espécie indicada
                                <select value={form.especieIndicada || ""} onChange={(event) => setForm({ ...form, especieIndicada: event.target.value })}>
                                    <option value="">Todas</option>
                                    <option>Cachorro</option>
                                    <option>Gato</option>
                                </select>
                            </label>
                            {campo("consumoRecomendado", "Consumo recomendado (g/kg/dia)", "number", true)}
                        </>}
                    </div>

                    {form.id && <p className="estoque-nota">A quantidade é alterada apenas por uma movimentação de entrada ou saída.</p>}
                    <div className="acoes">
                        <button disabled={ocupado}>Salvar</button>
                        <button type="button" className="secundario" onClick={() => setForm(null)}>Cancelar</button>
                    </div>
                </form>
            )}

            {mov && (
                <form className="estoque-formulario" onSubmit={(event) => {
                    event.preventDefault();
                    executar(async () => {
                        await api(`/estoque/${mov.id}/movimentacoes`, "POST", mov);
                        setMov(null);
                    });
                }}>
                    <div className="estoque-formulario-topo">
                        <div>
                            <span>Movimentação</span>
                            <h2>{mov.nome}</h2>
                        </div>
                    </div>
                    <div className="estoque-form-grade estoque-form-grade-menor">
                        <label>
                            Tipo
                            <select value={mov.tipo} onChange={(event) => setMov({ ...mov, tipo: event.target.value })}>
                                <option>ENTRADA</option>
                                <option>SAIDA</option>
                            </select>
                        </label>
                        <label>
                            Quantidade ({mov.unidade})
                            <input required type="number" min="0.00000001" step="any" value={mov.quantidade} onChange={(event) => setMov({ ...mov, quantidade: event.target.value })} />
                        </label>
                        <label>
                            Observação
                            <input maxLength={2000} value={mov.observacao} onChange={(event) => setMov({ ...mov, observacao: event.target.value })} />
                        </label>
                    </div>
                    <button disabled={ocupado}>Registrar movimentação</button>
                    <button type="button" className="secundario" onClick={() => setMov(null)}>Cancelar</button>
                </form>
            )}

            {racao && (
                <form className="estoque-formulario" onSubmit={(event) => {
                    event.preventDefault();
                    executar(async () => {
                        await api(`/estoque/${racao.id}/alimentacoes`, "POST", { animais: selecionados });
                        setRacao(null);
                        setSelecionados([]);
                    });
                }}>
                    <div className="estoque-formulario-topo">
                        <div>
                            <span>Alimentação</span>
                            <h2>Aplicar {racao.nome}</h2>
                        </div>
                    </div>
                    <div className="estoque-selecao-animais">
                        {animais
                            .filter((animal) => animal.statusAnimal !== "ADOTADO" && (!racao.especieIndicada || animal.tipoAnimal === racao.especieIndicada))
                            .map((animal) => (
                                <label key={animal.idAnimal}>
                                    <input
                                        type="checkbox"
                                        checked={selecionados.includes(animal.idAnimal)}
                                        onChange={(event) => setSelecionados(event.target.checked
                                            ? [...selecionados, animal.idAnimal]
                                            : selecionados.filter((id) => id !== animal.idAnimal))}
                                    />
                                    <span>
                                        <strong>{animal.nomeAnimal}</strong>
                                        <small>{animal.tipoAnimal} · {numero(animal.pesoAnimal)} kg · {animal.statusAnimal}</small>
                                    </span>
                                </label>
                            ))}
                    </div>
                    <button disabled={ocupado || !selecionados.length}>Aplicar ração</button>
                    <button type="button" className="secundario" onClick={() => setRacao(null)}>Cancelar</button>
                </form>
            )}

            <section className="estoque-secao">
                <div className="estoque-secao-titulo">
                    <div>
                        <h2>Itens em estoque</h2>
                        <p>Consulte quantidade, valor, nível mínimo e informações de alimentação.</p>
                    </div>
                    <span>{dados.length}</span>
                </div>

                {!dados.length && <p className="estado-veterinario-vazio">Nenhum item cadastrado.</p>}

                <div className="estoque-grade-itens">
                    {dados.map((registro) => {
                        const item = registro.item;
                        const percentualMinimo = Number(item.estoqueMinimo) > 0
                            ? Number(item.quantidade) / Number(item.estoqueMinimo) * 100
                            : 100;

                        return (
                            <article className="estoque-item-card" key={item.id}>
                                <div className="estoque-item-topo">
                                    <div>
                                        <span className="estoque-categoria">{categorias[item.categoria]}</span>
                                        <h3>{item.nome}</h3>
                                    </div>
                                    {registro.estoqueBaixo && (
                                        <span className={`estoque-situacao ${registro.esgotado ? "esgotado" : "baixo"}`}>
                                            {registro.esgotado ? "Esgotado" : "Estoque baixo"}
                                        </span>
                                    )}
                                </div>

                                <div className="estoque-item-numeros">
                                    <div>
                                        <span>Quantidade</span>
                                        <strong>{numero(item.quantidade)} {item.unidade}</strong>
                                    </div>
                                    <div>
                                        <span>Valor atual</span>
                                        <strong>{dinheiro(registro.valorTotal)}</strong>
                                    </div>
                                </div>

                                <div className="estoque-minimo-linha">
                                    <span>Mínimo: {numero(item.estoqueMinimo)} {item.unidade}</span>
                                    <div><i style={{ width: `${Math.min(100, percentualMinimo)}%` }} /></div>
                                </div>

                                <div className="estoque-item-detalhes">
                                    <p><strong>Valor unitário:</strong> {dinheiro(item.valorUnitario)} / {item.unidade}</p>
                                    <p><strong>Fornecedor:</strong> {item.fornecedor || "—"}</p>
                                    <p><strong>Entrada:</strong> {item.dataEntrada || "—"}</p>
                                    <p><strong>Validade:</strong> {item.validade || "—"}</p>
                                </div>

                                {item.categoria === "RACAO" && (
                                    <div className="estoque-racao-dados">
                                        <p><strong>{item.marca || "Sem marca"}</strong> · {item.especieIndicada || "Todas as espécies"}</p>
                                        <div className="estoque-racao-resumo">
                                            <span>{numero(item.consumoRecomendado)} g/kg/dia</span>
                                            <span>{registro.quantidadeAnimais} animais</span>
                                            <span>{numero(registro.consumoDiario)} g/dia</span>
                                        </div>
                                        <p>
                                            {registro.autonomiaDias === null
                                                ? "Sem consumo atual"
                                                : `Autonomia: ${numero(registro.autonomiaDias)} dias · previsão ${registro.previsaoFim}`}
                                        </p>

                                        {!!registro.animais.length && (
                                            <div className="estoque-animais-vinculados">
                                                {registro.animais.map((animal) => (
                                                    <div key={animal.idAnimal}>
                                                        <span>{animal.nomeAnimal} · {numero(animal.pesoAnimal)} kg · {numero(animal.consumoDiario)} g/dia</span>
                                                        <button disabled={ocupado} type="button" onClick={() => executar(() => api(`/estoque/alimentacoes/${animal.idAnimal}`, "DELETE"))}>
                                                            Encerrar
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="estoque-item-acoes">
                                    {item.categoria === "RACAO" && (
                                        <button type="button" onClick={() => { setRacao(item); setSelecionados([]); }}>
                                            Selecionar animais
                                        </button>
                                    )}
                                    <button type="button" onClick={() => setForm({ ...item })}>Editar</button>
                                    <button type="button" onClick={() => setMov({
                                        id: item.id,
                                        nome: item.nome,
                                        unidade: item.unidade,
                                        tipo: "ENTRADA",
                                        quantidade: "",
                                        observacao: ""
                                    })}>
                                        Entrada / saída
                                    </button>
                                    <button className="botao-estoque-excluir" disabled={ocupado} type="button" onClick={() => {
                                        if (window.confirm(`Excluir ${item.nome}? O histórico será preservado.`)) {
                                            executar(() => api(`/estoque/${item.id}`, "DELETE"));
                                        }
                                    }}>
                                        Excluir
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>

            <section className="estoque-secao">
                <div className="estoque-secao-titulo">
                    <div>
                        <h2>Histórico de movimentações</h2>
                        <p>Entradas, saídas manuais e consumo automático das rações.</p>
                    </div>
                    <span>{historico.length}</span>
                </div>

                <div className="rolagem">
                    <table>
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Item</th>
                                <th>Tipo</th>
                                <th>Quantidade</th>
                                <th>Valor registrado</th>
                                <th>Observação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historico.map((movimentacao) => (
                                <tr key={movimentacao.id}>
                                    <td>{new Date(movimentacao.data).toLocaleString("pt-BR")}</td>
                                    <td>{movimentacao.item.nome}</td>
                                    <td>{movimentacao.tipo}</td>
                                    <td>{numero(movimentacao.quantidade)} {movimentacao.item.unidade}</td>
                                    <td>{dinheiro(movimentacao.quantidade * movimentacao.valorUnitario)}</td>
                                    <td>{movimentacao.observacao}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </Painel>
    );
}
