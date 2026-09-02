import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";


function BotaoCadastrarUsuario() {
    const navigate = useNavigate();

    return (
        <button
            className="botao-cadastraUsuario"
            type="button"
            onClick={() => navigate("/cadastrarUsuarios")}
        >
            Cadastrar-se
        </button>
    );
}

function BotaoCadastrarAnimal() {
    const navigate = useNavigate();

    return (
        <button
            className="botao-cadastro-animal"
            type="button"
            onClick={() => navigate("/CadastrarAnimais")}
        >
            Cadastrar Animal
        </button>
    );
}
function BotaoEntrar() {
    const navigate = useNavigate();

    return (
        <button
            className="botao-entrar"
            type="button"
            onClick={() => navigate("/Login")}
        >
            Entrar
        </button>
    );
}
function BotaoHome() {
    const navigate = useNavigate();

    return (
        <button
            className="botao-home"
            type="button"
            onClick={() => navigate("/PaginaInicial")}
            style={{ background: "none", border: "none", padding: 0 }}
        >
            <img
                className="logo"
                src={logo}
                alt="Logo"
            />
        </button>
    );
}

function BotaoNoticias() {
    const navigate = useNavigate();
    return (<button
        className="botao-noticia"
        type="button"
        onClick={() => navigate("/PaginaNoticias")}
    >
        Notícias
    </button>);
}

function BotaoVerAnimais() {
    const navigate = useNavigate();
    return (<button
        className="botao-verAnimais"
        type="button"
        onClick={() => navigate("/PaginaVerAnimais")}
    >
        Ver Animais
    </button>);
}
function BotaoSobreNos() {
    const navigate = useNavigate();
    return (<button
        className="botao-sobreNos"
        type="button"
        onClick={() => navigate("/PaginaSobreNos")}
    >
        Sobre Nós
    </button>);
}


export {
    BotaoCadastrarUsuario,
    BotaoCadastrarAnimal,
    BotaoEntrar,
    BotaoHome,
    BotaoNoticias,
    BotaoVerAnimais,
    BotaoSobreNos
};