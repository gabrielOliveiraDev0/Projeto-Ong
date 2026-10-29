import { useConsulta } from "../servicos/useConsulta";
import { useAutenticacao } from "../servicos/contextoAutenticacao";
import { useNavigate, useParams } from "react-router-dom";

import Cabecalho from "../cabecalhos/CabecalhoPadrao";
import ImgExemplo from "../assets/ImgExemplo.png";

function DetalhesAnimais() {

    const { id } = useParams();
    const navigate = useNavigate();



    const { dados: animal, erro } = useConsulta(`/animais/${id}`, null);
    const { usuario } = useAutenticacao();


    if (!animal) {
        return <p>{erro || "Carregando..."}</p>;
    }

    return (
        <div>

            <Cabecalho />

            <section className="detalhes">

                <h1>
                    {animal.nomeAnimal}
                </h1>

                <img
                    src={
                        animal.imagemAnimal
                            ? `http://localhost:8080/uploads/animais/${animal.imagemAnimal}`
                            : ImgExemplo
                    }
                    alt={`Imagem de ${animal.nomeAnimal}`}
                />

                <strong>
                    Tipo: {animal.tipoAnimal}
                </strong>

                <strong>
                    Idade: {animal.idadeAnimal} anos
                </strong>

                <strong>
                    Sexo: {animal.sexoAnimal}
                </strong>

                <strong>
                    Peso: {animal.pesoAnimal} kg
                </strong>

                <strong>
                    Estado de Saúde: {animal.estadoSaudeAnimal}
                </strong>

                <strong>
                    Esterilização:{" "}
                    {animal.castracaoAnimal ? "Sim" : "Não"}
                </strong>

                <strong>
                    Status: {animal.statusAnimal}
                </strong>

                <strong>
                    Tratamento: {animal.tratamentoAnimal || "Não informado"}
                </strong>
                <strong>Vacinação: {animal.vacinacaoAnimal || "Não informada"}
                </strong>

                <strong>
                    Descrição: {animal.descricaoAnimal}
                </strong>

                <strong>
                    Endereço: {animal.regiaoAnimal}
                </strong>

                <strong>
                    Telefone: {animal.telefoneAnimal}
                </strong>

                {animal.statusAnimal === "DISPONIVEL" && !animal.removido && (!usuario || usuario.tipoUsuario === "USUARIO") && (
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/SolicitarAdocao/${animal.idAnimal}`
                            )
                        }
                    >
                        Adotar
                    </button>
                )}

            </section>

        </div>
    );
}

export default DetalhesAnimais;