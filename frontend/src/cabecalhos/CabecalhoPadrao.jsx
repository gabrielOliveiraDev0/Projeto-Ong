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

    const { usuario: usuarioLogado, sair: encerrarSessao } = useAutenticacao();

    const { dados: conversas } = useConsulta(usuarioLogado ? "/chat/conversas" : null);
    const naoLidas = conversas.reduce((total, c) => total + c.naoLidas, 0);
    function sair() {
        encerrarSessao();
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
                    <button type="button" onClick={() => navigate("/Chat")}>Chat{naoLidas > 0 ? ` (${naoLidas})` : ""}</button>
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