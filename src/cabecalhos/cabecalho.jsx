import logo from "../assets/logo.png";

function Cabecalho() {
    return (
        <section className="cabecalho">

            <img
                className="logo"
                src={logo}
                alt="Logo"
            />

            <button
                className="botao-noticia"
                type="button"
            >
                Notícias
            </button>

            <button
                className="botao-buscarOngs"
                type="button"
            >
                Buscar ONGs
            </button>

            <button
                className="botao-verAnimais"
                type="button"
            >
                Ver animais
            </button>

            <button
                className="botao-sobreNos"
                type="button"
            >
                Sobre nós
            </button>

            <button
                className="botao-entrar"
                type="button"
            >
                Entrar
            </button>

            <button
                className="botao-cadastraUsuario"
                type="button"
                onClick={() => navigate("/cadastrarUsuario")}
            >
                Cadastrar-se
            </button>

        </section>
    );
}



export default Cabecalho;