import { useAutenticacao } from "../servicos/contextoAutenticacao";
import { Navigate } from "react-router-dom";
import CadastrarAnimal from "../componentes/FormularioCadastro";
import Cabecalho from "../cabecalhos/CabecalhoPadrao";

function CadastrarAnimais() {

    const { usuario: usuarioLogado } = useAutenticacao();

    if (
        !usuarioLogado ||
        usuarioLogado.tipoUsuario !== "ADMINISTRADOR"
    ) {
        return <Navigate to="/PaginaInicial" replace />;
    }

    return (
        <section className="cadastrar-animais">

            <Cabecalho />

            <section className="corpoCadastro">

                <div className="divCorpoCadastro">

                    <h2 className="tituloCadastro">
                        Insira os dados do animal
                    </h2>

                    <CadastrarAnimal />

                </div>

            </section>

        </section>
    );
}

export default CadastrarAnimais;