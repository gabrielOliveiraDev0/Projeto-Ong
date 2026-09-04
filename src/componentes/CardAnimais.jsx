import ImgExemplo from "../assets/ImgExemplo.png";
import { BotaoDetalheAnimais } from "./Botoes";
function Animais() {
    return (
        <div className="card-animal">

            <div className="foto-animal">
                <img
                    src={ImgExemplo}
                    alt="Gatolino"
                />

                <button className="favorito">
                    ♥
                </button>

                <span className="status">
                    Disponível
                </span>
            </div>

            <div className="dados-animal">

                <h2>Gatolino</h2>

                <p className="descricao">
                    Gatolino é um gato muito dócil e brincalhão
                    que procura uma família para chamar de lar.
                </p>

                <div className="caracteristicas">
                    <span>🐱 Gato</span>
                    <span>♂ Macho</span>
                    <span>3 anos</span>
                </div>

                <p className="localizacao">
                    📍 Dourados - MS
                </p>

               <BotaoDetalheAnimais/>

            </div>

        </div>
    );
}

export default Animais;