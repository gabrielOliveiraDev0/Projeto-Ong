
import {
    BotaoCadastrarUsuario,
    BotaoEntrar, BotaoHome,
    BotaoNoticias, BotaoBuscarOngs,
    BotaoVerAnimais, BotaoSobreNos
} from "../componentes/Botoes";



function CabecalhoPadrao() {
    return (
        <section className="cabecalho">
            <BotaoHome />
            <section className="cabecalho-botoes">

                <BotaoNoticias />

                <BotaoBuscarOngs />

                <BotaoVerAnimais />

                <BotaoSobreNos />

                <BotaoEntrar />

                <BotaoCadastrarUsuario />
            </section>

        </section>
    );
}



export default CabecalhoPadrao;