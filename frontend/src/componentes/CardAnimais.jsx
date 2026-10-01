import { useEffect, useState } from "react";

import { BotaoDetalheAnimais } from "./Botoes";
import ImgExemplo from "../assets/ImgExemplo.png";

function Animais({ animal }) {

    const usuario = JSON.parse(
        localStorage.getItem("usuarioLogado")
    );

    const [favorito, setFavorito] = useState(false);

    useEffect(() => {

        if (!usuario) {
            return;
        }

        fetch(
            `http://localhost:8080/favoritos/usuario/${usuario.idUsuario}`
        )
            .then((resposta) => resposta.json())
            .then((dados) => {

                const existe = dados.some(
                    (item) =>
                        item.animal.idAnimal === animal.idAnimal
                );

                setFavorito(existe);
            })
            .catch((erro) => {
                console.error("Erro ao buscar favoritos:", erro);
            });

    }, [usuario?.idUsuario, animal.idAnimal]);

    async function alternarFavorito() {

        if (!usuario) {
            alert("Faça login para favoritar um animal.");
            return;
        }

        if (favorito) {

            const resposta = await fetch(
                `http://localhost:8080/favoritos?idUsuario=${usuario.idUsuario}&idAnimal=${animal.idAnimal}`,
                {
                    method: "DELETE"
                }
            );

            if (resposta.ok) {
                setFavorito(false);
            }

            return;
        }

        const resposta = await fetch(
            `http://localhost:8080/favoritos?idUsuario=${usuario.idUsuario}&idAnimal=${animal.idAnimal}`,
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
                            ? `http://localhost:8080/uploads/animais/${animal.imagemAnimal}`
                            : ImgExemplo
                    }
                    alt={`Imagem de ${animal.nomeAnimal}`}
                />

                <button
                    className="favorito"
                    type="button"
                    onClick={alternarFavorito}
                >
                    {favorito ? "♥" : "♡"}
                </button>

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