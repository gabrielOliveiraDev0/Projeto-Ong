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

export default BotaoCadastrarUsuario;