
import {
    BotaoCadastrarUsuario,
    BotaoEntrar, BotaoHome,
    BotaoNoticias,
    BotaoVerAnimais, BotaoSobreNos
} from "../componentes/Botoes";



function CabecalhoPadrao() {
    return (
        <section className="cabecalho">
            <BotaoHome />
            <section className="cabecalho-botoes">

                <BotaoNoticias />

                <BotaoVerAnimais />

                <BotaoSobreNos />

                <BotaoEntrar />

                <BotaoCadastrarUsuario />
            </section>

        </section>
    );
}



export default CabecalhoPadrao;