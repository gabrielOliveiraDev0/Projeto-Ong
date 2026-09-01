import { useNavigate } from "react-router-dom";

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
            onClick={() => navigate("/cadastrarAnimais")}
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

export {
    BotaoCadastrarUsuario,
    BotaoCadastrarAnimal,
    BotaoEntrar
};