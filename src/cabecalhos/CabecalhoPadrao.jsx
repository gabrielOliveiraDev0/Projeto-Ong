import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import {BotaoCadastrarUsuario,BotaoEntrar} from "../componentes/Botoes";

function cabecalhoPadrao() {
    const navigate = useNavigate();
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

            <BotaoEntrar />
        
            <BotaoCadastrarUsuario />
  
        

        </section>
    );
}



export default cabecalhoPadrao;