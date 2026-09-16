
import Cabecalho from "../cabecalhos/CabecalhoPadrao";
import CardAnimal from "../componentes/CardAnimais";
import { useEffect, useState } from "react";


function PaginaVerAnimais() {
    const [animais, setAnimais] = useState([]);
    const [tipoSelecionado, setTipoSelecionado] = useState("Todos");
    const [sexoSelecionado, setSexoSelecionado] = useState("Todos");
    const [castradoSelecionado, setCastradoSelecionado] = useState("Todos");
    const [idadeSelecionada, setIdadeSelecionada] = useState("Todos");
    const [pesquisa, setPesquisa] = useState("");
    const [pesoSelecionado, setPesoSelecionado] = useState("Todos");

    useEffect(() => {
        fetch("http://localhost:8080/animais")
            .then((resposta) => resposta.json())
            .then((dados) => {
                setAnimais(dados);
            })
            .catch((erro) => {
                console.error("Erro ao buscar animais:", erro);
            });
    }, []);
    const animaisFiltrados = animais.filter((animal) => {

        const tipoCorreto =
            tipoSelecionado === "Todos" ||
            animal.tipoAnimal === tipoSelecionado;

        const sexoCorreto =
            sexoSelecionado === "Todos" ||
            animal.sexoAnimal === sexoSelecionado;
        const castracaoCorreta =
            castradoSelecionado === "Todos" ||
            (castradoSelecionado === "Sim" && animal.castracaoAnimal === true) ||
            (castradoSelecionado === "Não" && animal.castracaoAnimal === false);
        const idadeCorreta =
            idadeSelecionada === "Todos" ||
            (idadeSelecionada === "0-1" && animal.idadeAnimal >= 0 && animal.idadeAnimal <= 1) ||
            (idadeSelecionada === "2-3" && animal.idadeAnimal >= 2 && animal.idadeAnimal <= 3) ||
            (idadeSelecionada === "4-6" && animal.idadeAnimal >= 4 && animal.idadeAnimal <= 6) ||
            (idadeSelecionada === "7-10" && animal.idadeAnimal >= 7 && animal.idadeAnimal <= 10) ||
            (idadeSelecionada === "10+" && animal.idadeAnimal > 10);
        const nomeCorreto =
            animal.nomeAnimal
                .toLowerCase()
                .includes(pesquisa.toLowerCase());
        const pesoCorreto =
            pesoSelecionado === "Todos" ||
            (pesoSelecionado === "0-5" && animal.pesoAnimal >= 0 && animal.pesoAnimal <= 5) ||
            (pesoSelecionado === "5-10" && animal.pesoAnimal > 5 && animal.pesoAnimal <= 10) ||
            (pesoSelecionado === "10-20" && animal.pesoAnimal > 10 && animal.pesoAnimal <= 20) ||
            (pesoSelecionado === "20-30" && animal.pesoAnimal > 20 && animal.pesoAnimal <= 30) ||
            (pesoSelecionado === "30+" && animal.pesoAnimal > 30);

        return tipoCorreto &&
            sexoCorreto &&
            castracaoCorreta &&
            idadeCorreta &&
            nomeCorreto &&
            pesoCorreto;
    });

    return (
        <div>
            <Cabecalho />
            <section className="pagina-buscar-ongs">
                <div className="ComponenteFiltroPreselecionado">
                    <h1>Filtro de pesquisa </h1>
                    <div className="filtrosPreselecionados">
                        <p>Nome: </p>
                        <input
                            type="text"
                            value={pesquisa}
                            onChange={(evento) => setPesquisa(evento.target.value)}
                            placeholder="Pesquisar animal..."
                        />
                    </div>

                    <p>Tipo:</p>
                    <select
                        value={tipoSelecionado}
                        onChange={(evento) => setTipoSelecionado(evento.target.value)}
                    >
                        <option value="Todos">Todos</option>
                        <option value="Gato">Gato</option>
                        <option value="Cachorro">Cachorro</option>
                    </select>

                    <p>Porte: </p>
                    <select
                        value={pesoSelecionado}
                        onChange={(evento) => setPesoSelecionado(evento.target.value)}
                    >
                        <option value="Todos">Todos</option>
                        <option value="0-5">0-5 kg</option>
                        <option value="5-10">5-10 kg</option>
                        <option value="10-20">10-20 kg</option>
                        <option value="20-30">20-30 kg</option>
                        <option value="30+">Mais de 30 kg</option>
                    </select>

                    <p>Sexo: </p>
                    <select
                        value={sexoSelecionado}
                        onChange={(evento) => setSexoSelecionado(evento.target.value)}
                    >
                        <option value="Todos">Todos</option>
                        <option value="Macho">Macho</option>
                        <option value="Fêmea">Fêmea</option>
                    </select>

                    <p>Idade: </p>
                    <select className="FiltroIdade" name="FiltroIdade"
                        value={idadeSelecionada}
                        onChange={(evento) => setIdadeSelecionada(evento.target.value)}
                    >
                        <option value="Todos">Todos</option>
                        <option value="0-1">0-1 anos</option>
                        <option value="2-3">2-3 anos</option>
                        <option value="4-6">4-6 anos</option>
                        <option value="7-10">7-10 anos</option>
                        <option value="10+">10+ anos</option>
                    </select>

                    <p>Castracao: </p>
                    <select
                        value={castradoSelecionado}
                        onChange={(evento) => setCastradoSelecionado(evento.target.value)}
                    >
                        <option value="Todos">Todos</option>
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                    </select>

                </div>
                <div className="CampoDeBusca">
                    <h2>Animais estão à procura de um lar.</h2>

                    <button className="botao-buscar" type="submit">
                        Buscar
                    </button>

                </div>

                <div className="resultado-busca">
                    <h4>Resultado da busca</h4>
                    {animaisFiltrados.map((animal) => (
                        <CardAnimal
                            key={animal.idAnimal}
                            animal={animal}
                        />
                    ))}
                </div>


            </section >
        </div >
    );
}
export default PaginaVerAnimais;
