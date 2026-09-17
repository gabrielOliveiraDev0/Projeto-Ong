import React from "react";
import CabecalhoCriandoUsuario from "../cabecalhos/CabecalhoPadrao";
import { useState } from "react";

function CadastrarUsuarios() {
    const [usuario, setUsuario] = useState({
        nome: "",
        sobrenome: "",
        email: "",
        numeroTelefone: "",
        senha: "",
        confirmarSenha: ""
    });
    async function cadastrarUsuario(evento) {
        evento.preventDefault();

        if (usuario.senha !== usuario.confirmarSenha) {
            alert("As senhas não são iguais.");
            return;
        }

        const usuarioParaEnviar = {
            nomeUsuario: usuario.nome,
            sobrenomeUsuario: usuario.sobrenome,
            emailUsuario: usuario.email,
            telefoneUsuario: usuario.numeroTelefone,
            senhaUsuario: usuario.senha
        };

        try {
            const resposta = await fetch("http://localhost:8080/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(usuarioParaEnviar)
            });

            if (resposta.status === 409) {
                alert("E-mail já cadastrado.");
                return;
            }

            if (!resposta.ok) {
                throw new Error("Erro ao cadastrar usuário");
            }

            alert("Usuário cadastrado com sucesso!");

        } catch (erro) {
            console.error(erro);
            alert("Erro ao cadastrar usuário.");
        }
    }
    return (
        <section className="cadastrar-usuarios">

            <CabecalhoCriandoUsuario />

            <h1> Realiza seu cadastro </h1>

            <div className="cadastro-usuario-via-google">

                <h2> Cadastrar via Google </h2>

                <button className="botao-cadastro-google" type="button">
                    Cadastrar com Google
                </button>

            </div>
            <div className="cadastro-usuario-via-formulario">
                <h2> ou prencha os campos a baixo </h2>
                <form className="formulario-cadastro-usuario"
                    onSubmit={cadastrarUsuario}
                >
                    <label htmlFor="nome">
                        Nome
                        <input
                            id="nome"
                            name="nome"
                            type="text"
                            placeholder="Ex: Digite seu nome"
                            value={usuario.nome}
                            onChange={(evento) =>
                                setUsuario({
                                    ...usuario,
                                    nome: evento.target.value
                                })
                            }
                        />
                    </label>

                    <label htmlFor="sobrenome">
                        Sobrenome
                        <input
                            id="sobrenome"
                            name="sobrenome"
                            type="text"
                            placeholder="Ex: Digite seu sobrenome"
                            value={usuario.sobrenome}
                            onChange={(evento) =>
                                setUsuario({
                                    ...usuario,
                                    sobrenome: evento.target.value
                                })
                            }
                        />
                    </label>

                    <label htmlFor="email">
                        Email
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Ex: email@email.com"
                            value={usuario.email}
                            onChange={(evento) =>
                                setUsuario({
                                    ...usuario,
                                    email: evento.target.value
                                })
                            }
                        />
                    </label>

                    <label htmlFor="numeroTelefone">
                        Telefone
                        <input
                            id="numeroTelefone"
                            name="numeroTelefone"
                            type="tel"
                            placeholder="Ex: (67) 99999-9999"
                            value={usuario.numeroTelefone}
                            onChange={(evento) =>
                                setUsuario({
                                    ...usuario,
                                    numeroTelefone: evento.target.value
                                })
                            }
                        />
                    </label>

                    <label htmlFor="senha">
                        Senha
                        <input
                            id="senha"
                            name="senha"
                            type="password"
                            placeholder="Digite sua senha"
                            value={usuario.senha}
                            onChange={(evento) =>
                                setUsuario({
                                    ...usuario,
                                    senha: evento.target.value
                                })
                            }
                        />
                    </label>

                    <label htmlFor="confirmarSenha">
                        Confirmar senha
                        <input
                            id="confirmarSenha"
                            name="confirmarSenha"
                            type="password"
                            placeholder="Confirme sua senha"
                            value={usuario.confirmarSenha}
                            onChange={(evento) =>
                                setUsuario({
                                    ...usuario,
                                    confirmarSenha: evento.target.value
                                })
                            }
                        />
                    </label>

                    <button className="botao-cadastrar" type="submit">
                        Cadastrar-se
                    </button>
                </form>
            </div>
            <div className="jatem conta">

                <a href="/login" className="link-login">
                    Já tenho conta, fazer login.
                </a>
            </div>
        </section>
    );
}

export default CadastrarUsuarios;