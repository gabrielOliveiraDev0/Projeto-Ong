import { API_URL } from "../servicos/api";
import MenuRelatorios from "../componentes/MenuRelatorios";
import Painel from "../componentes/Painel";
import ImgExemplo from "../assets/ImgExemplo.png";
import { useConsulta } from "../servicos/useConsulta";
import { numero } from "../servicos/formatacao";

const nomesStatus = {
    RESGATADO: "Resgatado",
    EM_TRATAMENTO: "Em tratamento",
    DISPONIVEL: "Disponível",
    ADOTADO: "Adotado"
};

function imagemAnimal(animal) {
    return animal.imagemAnimal
        ? `${API_URL}/uploads/animais/${animal.imagemAnimal}`
        : ImgExemplo;
}

export default function PaginaRelatorioAnimais() {
    const { dados: relatorio, erro } = useConsulta("/animais/relatorio", null);

    if (!relatorio) {
        return (
            <Painel titulo="Relatório de animais" erro={erro}>
            <MenuRelatorios />
                <p>Carregando...</p>
            </Painel>
        );
    }

    const cards = [
        ["Animais na ONG", relatorio.totalNaOng],
        ["Resgatados", relatorio.resgatados],
        ["Em tratamento", relatorio.emTratamento],
        ["Disponíveis", relatorio.disponiveis],
        ["Adotados", relatorio.adotados],
        ["Entradas registradas", relatorio.entradas],
        ["Saídas registradas", relatorio.saidas]
    ];

    return (
        <Painel titulo="Relatório de animais" erro={erro}>
            <MenuRelatorios />
            <p className="relatorio-animais-intro">
                Acompanhe o estoque atual de animais da ONG e o histórico de entradas e saídas.
            </p>

            <div className="resumo-animais-grade">
                {cards.map(([titulo, valor]) => (
                    <article className="resumo-animal-card" key={titulo}>
                        <span>{titulo}</span>
                        <strong>{numero(valor)}</strong>
                    </article>
                ))}
            </div>

            <section className="secao-relatorio-animais">
                <div className="secao-relatorio-titulo">
                    <div>
                        <h2>Animais atualmente na ONG</h2>
                        <p>Resgatados, em tratamento e disponíveis para adoção.</p>
                    </div>
                    <span>{relatorio.animais.length}</span>
                </div>

                {!relatorio.animais.length ? (
                    <p className="estado-veterinario-vazio">Nenhum animal atualmente na ONG.</p>
                ) : (
                    <div className="grade-relatorio-animais">
                        {relatorio.animais.map((animal) => (
                            <article className="relatorio-animal-item" key={animal.idAnimal}>
                                <img src={imagemAnimal(animal)} alt={`Imagem de ${animal.nomeAnimal}`} />
                                <div>
                                    <span>ID #{animal.idAnimal}</span>
                                    <h3>{animal.nomeAnimal}</h3>
                                    <p>{animal.tipoAnimal} · {numero(animal.pesoAnimal)} kg</p>
                                    <strong>{nomesStatus[animal.statusAnimal] || animal.statusAnimal}</strong>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            <section className="secao-relatorio-animais">
                <div className="secao-relatorio-titulo">
                    <div>
                        <h2>Entradas e saídas</h2>
                        <p>Histórico de movimentação dos animais registrado pelo sistema.</p>
                    </div>
                </div>

                <div className="rolagem">
                    <table>
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Animal</th>
                                <th>Movimentação</th>
                                <th>Status</th>
                                <th>Motivo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {relatorio.movimentacoes.map((movimentacao) => (
                                <tr key={movimentacao.id}>
                                    <td>{new Date(movimentacao.data).toLocaleString("pt-BR")}</td>
                                    <td>#{movimentacao.animal.idAnimal} · {movimentacao.animal.nomeAnimal}</td>
                                    <td>
                                        <span className={`movimento-animal movimento-${movimentacao.tipo.toLowerCase()}`}>
                                            {movimentacao.tipo}
                                        </span>
                                    </td>
                                    <td>{nomesStatus[movimentacao.statusAnimal] || movimentacao.statusAnimal}</td>
                                    <td>{movimentacao.motivo}</td>
                                </tr>
                            ))}
                            {!relatorio.movimentacoes.length && (
                                <tr>
                                    <td colSpan="5">Ainda não existem movimentações registradas.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </Painel>
    );
}
