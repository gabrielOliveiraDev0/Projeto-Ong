import { useParams } from "react-router-dom";
import Cabecalho from "../cabecalhos/CabecalhoPadrao";
import { useEffect, useState } from "react";


function DetalhesAnimais() {
    const { id } = useParams();
    const [animal, setAnimal] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8080/animais/${id}`)
            .then((resposta) => resposta.json())
            .then((dados) => {
                setAnimal(dados);
            })
            .catch((erro) => {
                console.error("Erro ao buscar animal:", erro);
            });
    }, [id]);

    if (!animal) {
        return <p>Carregando...</p>;
    }
    return (
        <div>
            <Cabecalho />
            <section className="detalhes">
                <h1>{animal.nomeAnimal}</h1>
                <img
                    src={
                        animal.imagemAnimal
                            ? `http://localhost:8080/uploads/animais/${animal.imagemAnimal}`
                            : ImgExemplo
                    }
                    alt={`Imagem de ${animal.nomeAnimal}`}
                />

                <strong>Tipo: {animal.tipoAnimal}</strong>

                <strong>Idade: {animal.idadeAnimal} anos</strong>

                <strong>Sexo: {animal.sexoAnimal}</strong>

                <strong>Peso: {animal.pesoAnimal} kg</strong>

                <strong>Estado de Saúde: {animal.estadoSaudeAnimal}</strong>

                <strong> Esterilização: {animal.castracaoAnimal ? "Sim" : "Não"} </strong>

                <strong>Alimentação: </strong>

                <strong>Descrição: {animal.descricaoAnimal}</strong>

                <strong>Região: {animal.regiaoAnimal}</strong>

                <strong>Telefone: {animal.telefoneAnimal}</strong>

            </section>


        </div>
    );
}

export default DetalhesAnimais;


