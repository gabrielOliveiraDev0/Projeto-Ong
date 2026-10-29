import { useConsulta } from "../servicos/useConsulta";
import { useAutenticacao } from "../servicos/contextoAutenticacao";
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

    const {
        usuario: usuarioLogado,
        sair: encerrarSessao
    } = useAutenticacao();

    const { dados: conversas } = useConsulta(
        usuarioLogado
            ? "/chat/conversas"
            : null
    );

    const naoLidas = conversas.reduce(
        (total, conversa) =>
            total + conversa.naoLidas,
        0
    );

    function sair() {
        encerrarSessao();
        navigate("/PaginaInicial");
    }

    return (
        <header className="cabecalho">

            <div className="cabecalho-logo">
                <BotaoHome />
            </div>

            <nav className="cabecalho-botoes">
                <BotaoHomeText />
                <BotaoNoticias />
                <BotaoVerAnimais />
                <BotaoSobreNos />
            </nav>

            <div className="cabecalho-acoes">

                {usuarioLogado ? (
                    <>
                        <button
                            className="cabecalho-chat"
                            type="button"
                            onClick={() =>
                                navigate("/Chat")
                            }
                        >
                            Chat

                            {naoLidas > 0 && (
                                <span className="chat-contador">
                                    {naoLidas}
                                </span>
                            )}
                        </button>

                        <span className="nome-usuario">
                            Olá, {usuarioLogado.nomeUsuario}
                        </span>

                        <button
                            className="botao-perfil"
                            type="button"
                            onClick={() =>
                                navigate("/AmbienteUsuario")
                            }
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

            </div>

        </header>
    );
}

export default CabecalhoPadrao;