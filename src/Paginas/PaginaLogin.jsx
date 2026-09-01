import Cabecalho from "../cabecalhos/CabecalhoPadrao";
import {
    BotaoCadastrarUsuario,
    BotaoCadastrarAnimal
} from "../componentes/Botoes";

function Login() {
   
    return (
        <section className="pagina-login">

            <Cabecalho />

            <h1> Login </h1>
        </section>
    );
}
export default Login;