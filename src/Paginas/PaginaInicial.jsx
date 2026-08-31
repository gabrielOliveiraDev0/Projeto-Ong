import Cabecalho from "../cabecalhos/CabecalhoPadrao";

function PaginaInicial() {
    return (
        <section className="pagina-inicial">

            <Cabecalho />

            <h1> Bem vindo a nossa ONG </h1>

            <div className="informacoes-ong">
                <h2> Sobre nós </h2>
                <p>
                    Somos uma organização sem fins lucrativos dedicada a ajudar animais em situação de vulnerabilidade. Nosso objetivo é proporcionar um lar seguro e amoroso para todos os animais que resgatamos, promovendo a adoção responsável e conscientizando a comunidade sobre a importância do cuidado com os animais.
                </p>
            </div>

        </section>
    );
}

export default PaginaInicial;