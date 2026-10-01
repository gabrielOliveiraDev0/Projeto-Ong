import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import Cabecalho from "../cabecalhos/CabecalhoPadrao";
import "../css/FormularioCadastroAnimal.css";

function PaginaEditarAnimal() {

    const { id } = useParams();
    const navigate = useNavigate();

    const usuarioLogado = JSON.parse(
        localStorage.getItem("usuarioLogado")
    );

    const [animal, setAnimal] = useState(null);

    const ehAdministrador =
        usuarioLogado?.tipoUsuario === "ADMINISTRADOR";

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

    if (!ehAdministrador) {
        return <Navigate to="/PaginaInicial" replace />;
    }

    if (!animal) {
        return <p>Carregando...</p>;
    }

    function alterarCampo(evento) {

        const { name, value } = evento.target;

        setAnimal({
            ...animal,
            [name]: value
        });
    }

    async function salvarAlteracoes(evento) {

        evento.preventDefault();

        const token = localStorage.getItem("token");

        const animalAtualizado = {
            ...animal,

            idadeAnimal: Number(animal.idadeAnimal),
            pesoAnimal: Number(animal.pesoAnimal),

            castracaoAnimal:
                animal.castracaoAnimal === true ||
                animal.castracaoAnimal === "true"
        };

        try {

            const resposta = await fetch(
                `http://localhost:8080/animais/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },

                    body: JSON.stringify(animalAtualizado)
                }
            );

            if (!resposta.ok) {
                throw new Error("Erro ao editar animal");
            }

            alert("Animal atualizado com sucesso!");

            navigate("/AmbienteUsuario");

        } catch (erro) {

            console.error(erro);

            alert("Erro ao atualizar animal.");
        }
    }

    return (
        <>
            <Cabecalho />

            <main className="corpoCadastro">

                <div className="divCorpoCadastro">

                    <h1 className="tituloCadastro">
                        Editar animal
                    </h1>

                    <form onSubmit={salvarAlteracoes}>

                        <label>
                            Nome
                            <input
                                name="nomeAnimal"
                                value={animal.nomeAnimal || ""}
                                onChange={alterarCampo}
                            />
                        </label>

                        <label>
                            Tipo
                            <select
                                name="tipoAnimal"
                                value={animal.tipoAnimal || "Gato"}
                                onChange={alterarCampo}
                            >
                                <option value="Gato">Gato</option>
                                <option value="Cachorro">Cachorro</option>
                            </select>
                        </label>

                        <label>
                            Sexo
                            <select
                                name="sexoAnimal"
                                value={animal.sexoAnimal || "Macho"}
                                onChange={alterarCampo}
                            >
                                <option value="Macho">Macho</option>
                                <option value="Fêmea">Fêmea</option>
                            </select>
                        </label>

                        <label>
                            Idade
                            <input
                                type="number"
                                name="idadeAnimal"
                                value={animal.idadeAnimal ?? ""}
                                onChange={alterarCampo}
                            />
                        </label>

                        <label>
                            Região
                            <input
                                name="regiaoAnimal"
                                value={animal.regiaoAnimal || ""}
                                onChange={alterarCampo}
                            />
                        </label>

                        <label>
                            Peso
                            <input
                                type="number"
                                step="0.1"
                                name="pesoAnimal"
                                value={animal.pesoAnimal ?? ""}
                                onChange={alterarCampo}
                            />
                        </label>

                        <label>
                            Estado de saúde
                            <select
                                name="estadoSaudeAnimal"
                                value={animal.estadoSaudeAnimal || "Saudável"}
                                onChange={alterarCampo}
                            >
                                <option value="Saudável">Saudável</option>
                                <option value="Em tratamento">Em tratamento</option>
                                <option value="Necessita cuidados">
                                    Necessita cuidados
                                </option>
                            </select>
                        </label>

                        <label>
                            Castrado
                            <select
                                name="castracaoAnimal"
                                value={String(animal.castracaoAnimal)}
                                onChange={alterarCampo}
                            >
                                <option value="true">Sim</option>
                                <option value="false">Não</option>
                            </select>
                        </label>

                        <label>
                            Status
                            <select
                                name="statusAnimal"
                                value={animal.statusAnimal || "RESGATADO"}
                                onChange={alterarCampo}
                            >
                                <option value="RESGATADO">
                                    Resgatado
                                </option>

                                <option value="EM_TRATAMENTO">
                                    Em tratamento
                                </option>

                                <option value="DISPONIVEL">
                                    Disponível
                                </option>

                                <option value="ADOTADO">
                                    Adotado
                                </option>
                            </select>
                        </label>

                        <label>
                            Descrição
                            <textarea
                                className="campo-descricao"
                                name="descricaoAnimal"
                                value={animal.descricaoAnimal || ""}
                                onChange={alterarCampo}
                            />
                        </label>

                        <label>
                            Telefone
                            <input
                                name="telefoneAnimal"
                                value={animal.telefoneAnimal || ""}
                                onChange={alterarCampo}
                            />
                        </label>

                        <label>
                            Pessoa para contato
                            <input
                                name="pessoaParaContatoAnimal"
                                value={animal.pessoaParaContatoAnimal || ""}
                                onChange={alterarCampo}
                            />
                        </label>

                        <button type="submit">
                            Salvar alterações
                        </button>

                    </form>

                </div>

            </main>
        </>
    );
}

export default PaginaEditarAnimal;