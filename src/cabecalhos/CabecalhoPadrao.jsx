
import {BotaoCadastrarUsuario,
    BotaoEntrar,BotaoHome, 
    BotaoNoticias,BotaoBuscarOngs,
    BotaoVerAnimais, BotaoSobreNos} from "../componentes/Botoes";


function CabecalhoPadrao() {
    return (
        <section className="cabecalho">
            
            <BotaoHome />
            
            <BotaoNoticias/>

            <BotaoBuscarOngs />

            <BotaoVerAnimais />


            <BotaoSobreNos />

            <BotaoEntrar />
        
            <BotaoCadastrarUsuario />
           
        

        </section>
    );
}



export default CabecalhoPadrao;