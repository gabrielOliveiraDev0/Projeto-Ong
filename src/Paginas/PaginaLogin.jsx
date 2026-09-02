import Cabecalho from "../cabecalhos/CabecalhoPadrao";
import { Link } from "react-router-dom";

function Login() {

    return (
        <div>
            <Cabecalho />
            <section className="pagina-login">
                <div>
                    <h1> Entrar via </h1>
                    <button> Google </button>
                </div>
                <div>
                    <h2>ou insira os dados de login</h2>
                    <form className="formulario-login">
                        <label for="email">
                            Email
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Ex: exemplo@exemplo.com"
                            />
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
                        <button className="botao-login" type="submit">
                            Entrar
                        </button>
                    </form>
                </div>
                <div>
                    <a href="/CadastrarUsuarios" className="link-cadastro">
                        Cadastrar-se
                    </a>
                </div>
            </section>
        </div>
    );
}
export default Login;