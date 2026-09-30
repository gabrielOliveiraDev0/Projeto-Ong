import Cabecalho from "../cabecalhos/CabecalhoPadrao";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {

    const navigate = useNavigate();

    const [login, setLogin] = useState({
        email: "",
        senha: ""
    });

    async function fazerLogin(evento) {
        evento.preventDefault();

        try {
            const resposta = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: login.email,
                    senha: login.senha
                })
            });

            if (resposta.status === 401) {
                alert("E-mail ou senha inválidos.");
                return;
            }

            if (!resposta.ok) {
                throw new Error("Erro ao realizar login");
            }

            const dados = await resposta.json();

            localStorage.setItem("token", dados.token);

            localStorage.setItem(
                "usuarioLogado",
                JSON.stringify(dados.usuario)
            );

            alert("Login realizado com sucesso!");

            navigate("/PaginaInicial");

        } catch (erro) {
            console.error(erro);
            alert("Erro ao realizar login.");
        }
    }

    return (
        <div>
            <Cabecalho />

            <section className="pagina-login">

                <div>
                    <h1>Entrar via</h1>
                    <button type="button">
                        Google
                    </button>
                </div>

                <div>
                    <h2>ou insira os dados de login</h2>

                    <form
                        className="formulario-login"
                        onSubmit={fazerLogin}
                    >

                        <label htmlFor="email">
                            Email
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Ex: exemplo@exemplo.com"
                                value={login.email}
                                onChange={(evento) =>
                                    setLogin({
                                        ...login,
                                        email: evento.target.value
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
                                placeholder="Ex: Digite sua senha"
                                value={login.senha}
                                onChange={(evento) =>
                                    setLogin({
                                        ...login,
                                        senha: evento.target.value
                                    })
                                }
                            />
                        </label>

                        <button
                            className="botao-login"
                            type="submit"
                        >
                            Entrar
                        </button>

                    </form>
                </div>

                <div>
                    <Link
                        to="/CadastrarUsuarios"
                        className="link-cadastro"
                    >
                        Cadastrar-se
                    </Link>
                </div>

            </section>
        </div>
    );
}

export default Login;