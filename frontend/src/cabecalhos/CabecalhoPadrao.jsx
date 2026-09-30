import { useNavigate } from "react-router-dom";

import {
    BotaoCadastrarUsuario,
    BotaoEntrar,
    BotaoHome,
    BotaoNoticias,
    BotaoVerAnimais,
    BotaoSobreNos, 
    BotaoHomeText
} from "../componentes/Botoes";

function CabecalhoPadrao() {

    const navigate = useNavigate();

    const usuarioLogado = JSON.parse(
        localStorage.getItem("usuarioLogado")
    );

    function sair() {
        localStorage.removeItem("usuarioLogado");
        localStorage.removeItem("token");
        navigate("/PaginaInicial");
    }

    return (
        <section className="cabecalho">

            <BotaoHome />

            <section className="cabecalho-botoes">

                <BotaoHomeText/>
                <BotaoNoticias />
                <BotaoVerAnimais />
                <BotaoSobreNos />
                
            </section>

            {usuarioLogado ? (
                <>
                    <span className="nome-usuario">
                        Olá, {usuarioLogado.nomeUsuario}
                    </span>

                    <button
                        className="botao-perfil"
                        type="button"
                        onClick={() => navigate("/AmbienteUsuario")}
                    >
                        Perfil
                    </button>

                    <button
                        className="botao-sair"
                        type="button"
                        onClick={sair}
                    >
                        Sair
                    </button>
                </>
            ) : (
                <>
                    <BotaoEntrar />
                    <BotaoCadastrarUsuario />
                </>
            )}

        </section>
    );
}

export default CabecalhoPadrao;