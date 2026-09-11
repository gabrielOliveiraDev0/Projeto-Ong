

import CadastrarAnimal from "../componentes/FormularioCadastro";

import Cabecalho from "../cabecalhos/CabecalhoPadrao";


function CadastrarAnimais() {
    

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

