import Cabecalho from "../cabecalhos/CabecalhoPadrao";

function PaginaSobreNos() {
    return (
        <section className="pagina-sobre-nos">
            <Cabecalho />
            <div>
                <h1>Sobre Nós</h1>
                <p>
                    Somos uma organização sem fins lucrativos dedicada a ajudar animais em situação de vulnerabilidade. Nosso objetivo é proporcionar um lar seguro e amoroso para todos os animais que resgatamos, promovendo a adoção responsável e conscientizando a comunidade sobre a importância do cuidado com os animais.
                </p>
                <p>
                    Nossa equipe é composta por voluntários apaixonados por animais, que trabalham incansavelmente para resgatar, cuidar e encontrar lares permanentes para os animais necessitados. Acreditamos que todos os animais merecem amor, respeito e uma chance de viver uma vida feliz.
                </p>
               
            </div>
        </section>

    );
}
export default PaginaSobreNos;