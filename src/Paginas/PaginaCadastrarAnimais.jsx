
import { useState } from "react";

import Cabecalho from "../cabecalhos/cabacalhoLoginefetuado";


function CadastrarAnimais() {
    const [animal, setAnimal] = useState({
        nome: "",
        tipo: "Gato",
        sexo: "Macho",
        idade: "",
        regiao: "",
        peso: "",
        estadoSaude: "Saudável",
        castrado: "Sim",
        descricao: "",
        telefone: "",
        contato: ""
    });

    async function salvarAnimal(event) {
        event.preventDefault();

        try {
            const resposta = await fetch("http://localhost:3001/animais", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(animal)
            });

            if (!resposta.ok) {
                throw new Error("Erro ao cadastrar animal");
            }

            const dados = await resposta.json();

            console.log("Animal cadastrado:", dados);

            alert("Animal cadastrado com sucesso!");

        } catch (erro) {
            console.error("Erro:", erro);
            alert("Erro ao cadastrar animal.");
        }
    }

    function alterarCampo(event) {
        const { name, value } = event.target;

        setAnimal({
            ...animal,
            [name]: value
        });
    }

    return (
        <section className="cadastrar-animais">

           <Cabecalho />

            <section className="corpoCadastro">

                <div className="divCorpoCadastro">

                    <h2 className="tituloCadastro">
                        Insira os dados do animal
                    </h2>

                    <form onSubmit={salvarAnimal}>

                        <label>
                            Nome

                            <input
                                name="nome"
                                type="text"
                                placeholder="Ex: Gatolino"
                                value={animal.nome}
                                onChange={alterarCampo}
                            />
                        </label>

                        <label>
                            Tipo

                            <select
                                name="tipo"
                                className="raca"
                                value={animal.tipo}
                                onChange={alterarCampo}
                            >
                                <option value="Gato">
                                    Gato
                                </option>

                                <option value="Cachorro">
                                    Cachorro
                                </option>
                            </select>
                        </label>

                        <label>
                            Sexo

                            <select
                                name="sexo"
                                className="sexo"
                                value={animal.sexo}
                                onChange={alterarCampo}
                            >
                                <option value="Macho">
                                    Macho
                                </option>

                                <option value="Fêmea">
                                    Fêmea
                                </option>
                            </select>
                        </label>

                        <label>
                            Idade (Anos)

                            <input
                                name="idade"
                                type="number"
                                placeholder="Ex: 1"
                                min="0"
                                value={animal.idade}
                                onChange={alterarCampo}
                            />
                        </label>

                        <label>
                            Região

                            <input
                                name="regiao"
                                type="text"
                                placeholder="Ex: Rua 27 de Março"
                                value={animal.regiao}
                                onChange={alterarCampo}
                            />
                        </label>

                        <label>
                            Estado de saúde

                            <select
                                name="estadoSaude"
                                className="estadoSaude"
                                value={animal.estadoSaude}
                                onChange={alterarCampo}
                            >
                                <option value="Saudável">
                                    Saudável
                                </option>

                                <option value="Em tratamento">
                                    Em tratamento
                                </option>
                            </select>
                        </label>

                        <label>
                            Ele/Ela é castrado(a)?

                            <select
                                name="castrado"
                                className="fertilidade"
                                value={animal.castrado}
                                onChange={alterarCampo}
                            >
                                <option value="Sim">
                                    Sim
                                </option>

                                <option value="Não">
                                    Não
                                </option>
                            </select>
                        </label>

                        <label>
                            Peso (Kg)

                            <input
                                name="peso"
                                type="number"
                                placeholder="Ex: 10"
                                value={animal.peso}
                                onChange={alterarCampo}
                            />
                        </label>

                        <label>
                            Breve descrição do animal

                            <input
                                name="descricao"
                                className="campo-descricao"
                                type="text"
                                placeholder="Ex: Gatolino é um gatinho branco e medroso, se assusta fácil."
                                value={animal.descricao}
                                onChange={alterarCampo}
                            />
                        </label>

                        <label>
                            Foto do animal

                            <input
                                className="foto"
                                type="file"
                                accept="image/*"
                            />
                        </label>

                        <label>
                            Número de telefone

                            <input
                                name="telefone"
                                type="text"
                                placeholder="Ex: (11) 11111-1111"
                                value={animal.telefone}
                                onChange={alterarCampo}
                            />
                        </label>

                        <label>
                            Pessoa para contato

                            <input
                                name="contato"
                                type="text"
                                placeholder="Nome para contato"
                                value={animal.contato}
                                onChange={alterarCampo}
                            />
                        </label>

                        <button
                            className="botao-confirmar"
                            type="submit"
                        >
                            Confirmar
                        </button>

                    </form>

                </div>

            </section>

        </section>
    );
}

export default CadastrarAnimais;

