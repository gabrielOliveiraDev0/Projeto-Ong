
import { BotaoDetalheAnimais } from "./Botoes";
import ImgExemplo from "../assets/ImgExemplo.png";
function Animais({ animal }) {
    return (
        <div className="card-animal">

            <div className="foto-animal">
                <img
                    src={
                        animal.imagemAnimal
                            ? `http://localhost:8080/uploads/animais/${animal.imagemAnimal}`
                            : ImgExemplo
                    }
                    alt={`Imagem de ${animal.nomeAnimal}`}
                />

                <button className="favorito">
                    ♥
                </button>

                <span className="status">
                    Disponível
                </span>
            </div>

            <div className="dados-animal">

                <h2>{animal.nomeAnimal}</h2>

                <p className="descricao">
                    <p className="descricao">
                        {animal.descricaoAnimal}
                    </p>
                </p>

                <div className="caracteristicas">
                    <span>{animal.tipoAnimal}</span>
                    <span>{animal.sexoAnimal}</span>
                    <span>{animal.idadeAnimal} anos</span>
                </div>

                <p className="localizacao">
                    📍 {animal.regiaoAnimal}
                </p>

                <BotaoDetalheAnimais idAnimal={animal.idAnimal} />

            </div>

        </div>
    );
}

export default Animais;