
import Cabecalho from "../cabecalhos/CabecalhoPadrao";
import CardAnimal from "../componentes/Animais";

function PaginaVerAnimais() {
    return (
        <div>
            <Cabecalho />
            <section className="pagina-buscar-ongs">
                <div className="ComponenteFiltroPreselecionado">
                    <h1>Filtro de pesquisa </h1>
                    <div className="filtrosPreselecionados">
                        <select className="FiltroTipoAnimal" name="FiltroTipo">
                            <option value="regiao1">Gato</option>
                            <option value="regiao2">Cachorro</option>
                        </select>
                        <select className="FiltroRegiao" name="FiltroRegiao">
                            <option value="regiao1">Região 1</option>
                            <option value="regiao2">Região 2</option>
                            <option value="regiao3">Região 3</option>
                        </select>
                        <select className="FiltroSexo" name="FiltroSexo">
                            <option value="regiao1">Macho</option>
                            <option value="regiao2">Fêmea</option>
                        </select>
                        <select className="FiltroIdade" name="FiltroIdade">
                            <option value="regiao1">0-1 anos</option>
                            <option value="regiao2">1-3 anos</option>
                            <option value="regiao3">4-6 anos</option>
                            <option value="regiao4">7-10 anos</option>
                            <option value="regiao5">10+ anos</option>
                        </select>
                        <select className="FiltroAnimalCastrado" name="FiltroAnimalCastrado">
                            <option value="regiao1">Castrado</option>
                            <option value="regiao2">Não Castrado</option>
                        </select>
                    </div>
                </div>
                <div className="CampoDeBusca">
                    <h2>Animais estão à procura de um lar.</h2>
                    <input
                        type="text"
                        placeholder="Digite o nome do animal ou da ONG"
                    />
                    <button className="botao-buscar" type="submit">
                        Buscar
                    </button>

                </div>

                <div className="resultado-busca">
                    <h4>Resultado da busca</h4>
                    <CardAnimal
                        nome="Gatolino"
                        tipo="Gato"
                        sexo="Macho"
                        idade="3 anos"
                        localizacao="Dourados - MS"  
                    />
                </div>

            </section >
        </div >
    );
}
export default PaginaVerAnimais;
