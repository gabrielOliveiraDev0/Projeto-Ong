import Cabecalho from "../cabecalhos/CabecalhoPadrao";
import { useNavigate } from "react-router-dom";
import {
    BotaoCadastrarUsuario,
    BotaoCadastrarAnimal
} from "../componentes/Botoes";

function Login() {
    const navigate = useNavigate();
    return (
        <section className="pagina-login">

            <Cabecalho />

            <h1> Login </h1>
        </section>
    );
}
export default Login;