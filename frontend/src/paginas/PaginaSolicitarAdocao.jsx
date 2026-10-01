import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import Cabecalho from "../cabecalhos/CabecalhoPadrao";
import "../css/FormularioCadastroAnimal.css";

function PaginaSolicitarAdocao() {

    const { idAnimal } = useParams();
    const navigate = useNavigate();

    const usuario = JSON.parse(
        localStorage.getItem("usuarioLogado")
    );

    const [questionario, setQuestionario] = useState({
        tipoMoradia: "Casa",
        residenciaPermiteAnimais: "true",
        possuiOutrosAnimais: "false",
        tempoAnimalSozinho: "",
        motivoAdocao: "",
        experienciaComAnimais: "",
        rendaMensal: ""
    });

    if (!usuario) {
        return <Navigate to="/Login" replace />;
    }

    function alterarCampo(evento) {
        setQuestionario({
            ...questionario,
            [evento.target.name]: evento.target.value
        });
    }

    async function enviarSolicitacao(evento) {
        evento.preventDefault();

        try {

            const dadosParaEnviar = {
                idUsuario: usuario.idUsuario,
                idAnimal: Number(idAnimal),

                tipoMoradia: questionario.tipoMoradia,

                residenciaPermiteAnimais:
                    questionario.residenciaPermiteAnimais === "true",

                possuiOutrosAnimais:
                    questionario.possuiOutrosAnimais === "true",

                tempoAnimalSozinho:
                    questionario.tempoAnimalSozinho,

                motivoAdocao:
                    questionario.motivoAdocao,

                experienciaComAnimais:
                    questionario.experienciaComAnimais,

                rendaMensal:
                    Number(questionario.rendaMensal)
            };

            console.log("Enviando:", dadosParaEnviar);

            const resposta = await fetch(
                "http://localhost:8080/adocoes",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(dadosParaEnviar)
                }
            );

            if (!resposta.ok) {

                const erro = await resposta.text();

                console.error("Erro do backend:", erro);

                alert(
                    `Erro ao enviar solicitação. Código: ${resposta.status}`
                );

                return;
            }

            alert("Solicitação enviada com sucesso!");

            navigate("/AmbienteUsuario");

        } catch (erro) {

            console.error("Erro:", erro);

            alert("Erro ao conectar com o backend.");
        }
    }

    return (
        <>
            <Cabecalho />

            <main className="corpoCadastro">

                <div className="divCorpoCadastro">

                    <h1 className="tituloCadastro">
                        Solicitação de adoção
                    </h1>

                    <form onSubmit={enviarSolicitacao}>

                        <label>
                            Tipo de moradia

                            <select
                                name="tipoMoradia"
                                value={questionario.tipoMoradia}
                                onChange={alterarCampo}
                            >
                                <option value="Casa">Casa</option>
                                <option value="Apartamento">Apartamento</option>
                                <option value="Chácara">Chácara</option>
                            </select>
                        </label>

                        <label>
                            A residência permite animais?

                            <select
                                name="residenciaPermiteAnimais"
                                value={questionario.residenciaPermiteAnimais}
                                onChange={alterarCampo}
                            >
                                <option value="true">Sim</option>
                                <option value="false">Não</option>
                            </select>
                        </label>

                        <label>
                            Possui outros animais?

                            <select
                                name="possuiOutrosAnimais"
                                value={questionario.possuiOutrosAnimais}
                                onChange={alterarCampo}
                            >
                                <option value="false">Não</option>
                                <option value="true">Sim</option>
                            </select>
                        </label>

                        <label>
                            Renda mensal

                            <input
                                type="number"
                                name="rendaMensal"
                                min="0"
                                step="0.01"
                                placeholder="Ex: 2500"
                                value={questionario.rendaMensal}
                                onChange={alterarCampo}
                                required
                            />
                        </label>

                        <label>
                            Quanto tempo o animal ficará sozinho?

                            <input
                                name="tempoAnimalSozinho"
                                placeholder="Ex: 4 horas por dia"
                                value={questionario.tempoAnimalSozinho}
                                onChange={alterarCampo}
                                required
                            />
                        </label>

                        <label>
                            Por que deseja adotar?

                            <textarea
                                className="campo-descricao"
                                name="motivoAdocao"
                                value={questionario.motivoAdocao}
                                onChange={alterarCampo}
                                required
                            />
                        </label>

                        <label>
                            Já teve animais? Conte sua experiência.

                            <textarea
                                className="campo-descricao"
                                name="experienciaComAnimais"
                                value={questionario.experienciaComAnimais}
                                onChange={alterarCampo}
                                required
                            />
                        </label>

                        <button type="submit">
                            Enviar solicitação
                        </button>

                    </form>

                </div>

            </main>
        </>
    );
}

export default PaginaSolicitarAdocao;