import React from "react";
import CabecalhoCriandoUsuario from "../cabecalhos/CabecalhoCriandoUsuario";

function CadastrarUsuarios() {
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
                <form className="formulario-cadastro-usuario">
                    <label for="nome">
                        Nome
                        <input
                            id="nome"
                            name="nome"
                            type="text"
                            placeholder="Ex: Digite seu nome"
                        />
                    </label>

                    <label for="email">
                        Email
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Ex: exemplo@exemplo.com"
                        />
                    </label>
                    <label for="numeroTelefone">
                        Número de telefone
                        <input
                            id="numeroTelefone"
                            name="numeroTelefone"
                            type="text"
                            placeholder="Ex: (11) 99999-9999"
                        />
                    </label>
                    <label for="ragiao">
                        Região
                        <select id="regiao" name="regiao">
                            <option value="regiao1">Região 1</option>
                            <option value="regiao2">Região 2</option>
                            <option value="regiao3">Região 3</option>
                        </select>
                    </label>
                    <label for="senha">
                        Senha
                        <input
                            id="senha"
                            name="senha"
                            type="password"
                            placeholder="Ex: Digite sua senha"
                        />
                    </label>
                    <label for="confirmarSenha">
                        Confirmar senha
                        <input
                            id="confirmarSenha"
                            name="confirmarSenha"
                            type="password"
                            placeholder="Ex: Confirme sua senha"
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