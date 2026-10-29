import Cabecalho from "../cabecalhos/CabecalhoPadrao";
import { Link } from "react-router-dom";
import "../css/Gestao.css";
export default function Painel({ titulo, erro, children }) {
    return <><Cabecalho /><main className="gestao"><Link to="/AmbienteUsuario">Voltar ao perfil</Link>
        <h1>{titulo}</h1>{erro && <p role="alert" className="aviso">{erro}</p>}{children}</main></>;
}
