import { API_URL } from "../servicos/api";
import { useConsulta } from "../servicos/useConsulta";
import { useAutenticacao } from "../servicos/contextoAutenticacao";
import { requisicao } from "../servicos/api";
import { useEffect, useState } from "react";

import { BotaoDetalheAnimais } from "./Botoes";
import ImgExemplo from "../assets/ImgExemplo.png";

function Animais({ animal }) {

    const { usuario } = useAutenticacao();

    const [favorito, setFavorito] = useState(false);

    const { dados: favoritos } = useConsulta(usuario?.tipoUsuario === "USUARIO" ? `/favoritos/usuario/${usuario.idUsuario}` : null);
    useEffect(() => { setFavorito(favoritos.some(f => f.animal.idAnimal === animal.idAnimal)); }, [favoritos, animal.idAnimal]);

    async function alternarFavorito() {

        if (usuario?.tipoUsuario !== "USUARIO") {
            alert("Faça login para favoritar um animal.");
            return;
        }

        if (favorito) {

            const resposta = await requisicao(
                `/favoritos?idUsuario=${usuario.idUsuario}&idAnimal=${animal.idAnimal}`,
                {
                    method: "DELETE"
                }
            );

            if (resposta.ok) {
                setFavorito(false);
            }

            return;
        }

        const resposta = await requisicao(
            `/favoritos?idUsuario=${usuario.idUsuario}&idAnimal=${animal.idAnimal}`,
            {
                method: "POST"
            }
        );

        if (resposta.ok) {
            setFavorito(true);
        }
    }

    return (
        <div className="card-animal">

            <div className="foto-animal">

                <img
                    src={
                        animal.imagemAnimal
                            ? `${API_URL}/uploads/animais/${animal.imagemAnimal}`
                            : ImgExemplo
                    }
                    alt={`Imagem de ${animal.nomeAnimal}`}
                />

                {(!usuario || usuario.tipoUsuario === "USUARIO") && <button
                    className="favorito"
                    type="button"
                    onClick={alternarFavorito}
                >
                    {favorito ? "♥" : "♡"}
                </button>}

                <span className="status">
                    Disponível
                </span>

            </div>

            <div className="dados-animal">

                <h2>{animal.nomeAnimal}</h2>

                <p className="descricao">
                    {animal.descricaoAnimal}
                </p>

                <div className="caracteristicas">
                    <span>{animal.tipoAnimal}</span>
                    <span>{animal.sexoAnimal}</span>
                    <span>{animal.idadeAnimal} anos</span>
                </div>

                <p className="localizacao">
                    📍 {animal.regiaoAnimal}
                </p>

                <BotaoDetalheAnimais
                    idAnimal={animal.idAnimal}
                />

            </div>

        </div>
    );
}

export default Animais;