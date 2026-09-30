
import {
    BotaoCadastrarUsuario,
    BotaoEntrar, BotaoHome,
    BotaoNoticias,
    BotaoVerAnimais, BotaoSobreNos, 
    BotaoHomeText
} from "../componentes/Botoes";



function CabecalhoPadrao() {
    return (
        <section className="cabecalho">
            <BotaoHome />
            <section className="cabecalho-botoes">

                <BotaoHomeText />
                
                <BotaoNoticias />

                <BotaoVerAnimais />

                <BotaoSobreNos />

               

            </section>
            <section className="BotaoInteracaoUsuario"> 

                 <BotaoEntrar />

                <BotaoCadastrarUsuario />
                
            </section>

        </section>
    );
}



export default CabecalhoPadrao;