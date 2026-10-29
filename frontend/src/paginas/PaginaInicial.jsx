import { useState } from "react";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

import Cabecalho from "../cabecalhos/CabecalhoPadrao";
import { BotaoVerAnimais } from "../componentes/Botoes";
import {
    Indicadores,
    RodapeInstitucional
} from "../componentes/ComponentesInstitucionais";

import { useConsulta } from "../servicos/useConsulta";

import acolhimento from "../assets/prototipo/acolhimento.gif";
import abrigo from "../assets/prototipo/abrigo.webp";
import abracoGato from "../assets/prototipo/abraco-gato.webp";

import "../css/PaginaInicial.css";

function enderecoImagemNoticia(imagem) {
    if (!imagem) {
        return null;
    }

    return `http://localhost:8080/uploads/noticias/${imagem}`;
}

function PaginaInicial() {
    const [doacaoAberta, setDoacaoAberta] = useState(false);
    const [codigoDoacao, setCodigoDoacao] = useState("");

    const { dados: noticias } = useConsulta("/noticias", []);

    const { dados: indicadores } = useConsulta("/indicadores", {
        adotados: 0,
        racaoKg: 0,
        disponiveis: 0
    });

    function abrirDoacao() {
        const codigo =
            "DOACAO-ONG-" +
            Math.random()
                .toString(36)
                .substring(2, 14)
                .toUpperCase();

        setCodigoDoacao(codigo);
        setDoacaoAberta(true);
    }

    function fecharDoacao() {
        setDoacaoAberta(false);
    }

    return (
        <section className="pagina-inicial institucional">
            <Cabecalho />

            <main className="inicial-conteudo">

                <section
                    className="inicial-hero"
                    aria-labelledby="inicial-titulo"
                >
                    <div className="inicial-hero-texto">
                        <span className="inicial-etiqueta">
                            ADOÇÃO RESPONSÁVEL
                        </span>

                        <h1 id="inicial-titulo">
                            Um novo começo pode começar com uma adoção.
                        </h1>

                        <p className="inicial-hero-descricao">
                            Conheça animais resgatados pela nossa ONG,
                            acompanhe histórias de recuperação e encontre
                            um novo amigo para fazer parte da sua família.
                        </p>

                        <div className="inicial-acoes">
                            <BotaoVerAnimais />

                            <button
                                className="inicial-botao-doacao"
                                type="button"
                                onClick={abrirDoacao}
                            >
                                Fazer doação
                            </button>

                            <Link
                                className="inicial-botao-secundario"
                                to="/PaginaSobreNos"
                            >
                                Conheça a ONG
                            </Link>
                        </div>

                        <div className="inicial-hero-destaques">
                            <span>✓ Adoção responsável</span>
                            <span>✓ Acompanhamento veterinário</span>
                            <span>✓ Animais resgatados e acolhidos</span>
                        </div>
                    </div>

                    <div className="inicial-hero-visual">
                        <div className="inicial-hero-bolha inicial-hero-bolha-1" />
                        <div className="inicial-hero-bolha inicial-hero-bolha-2" />

                        <img
                            className="inicial-hero-imagem"
                            src={acolhimento}
                            alt="Ilustração de uma mulher acolhendo um cachorro"
                        />
                    </div>
                </section>

                <Indicadores dados={indicadores} />

                <section
                    className="inicial-como-ajudamos"
                    aria-labelledby="ajudamos-titulo"
                >
                    <div className="inicial-secao-cabecalho">
                        <div>
                            <span className="inicial-secao-etiqueta">
                                NOSSO TRABALHO
                            </span>

                            <h2 id="ajudamos-titulo">
                                Do resgate até um novo lar
                            </h2>
                        </div>

                        <p>
                            Cada animal passa por um processo de acolhimento,
                            cuidado e preparação antes de estar disponível
                            para adoção.
                        </p>
                    </div>

                    <div className="inicial-etapas">

                        <article>
                            <span>01</span>

                            <h3>Resgate</h3>

                            <p>
                                O animal é acolhido, identificado e recebe
                                uma ficha com suas principais informações.
                            </p>
                        </article>

                        <article>
                            <span>02</span>

                            <h3>Tratamento</h3>

                            <p>
                                A equipe veterinária acompanha saúde,
                                vacinação, castração e necessidades
                                de tratamento.
                            </p>
                        </article>

                        <article>
                            <span>03</span>

                            <h3>Disponível</h3>

                            <p>
                                Quando está apto, o animal passa a aparecer
                                para pessoas interessadas em adoção.
                            </p>
                        </article>

                        <article>
                            <span>04</span>

                            <h3>Novo lar</h3>

                            <p>
                                Após a análise do formulário de interesse,
                                a adoção é aprovada e o animal ganha
                                uma nova família.
                            </p>
                        </article>

                    </div>
                </section>

                <section
                    className="inicial-abrigos"
                    aria-labelledby="abrigos-titulo"
                >
                    <div className="inicial-secao-cabecalho">
                        <div>
                            <span className="inicial-secao-etiqueta">
                                QUEM SOMOS
                            </span>

                            <h2 id="abrigos-titulo">
                                Cuidado que transforma histórias
                            </h2>
                        </div>
                    </div>

                    <article className="inicial-abrigo">

                        <div className="informacoes-ong">
                            <span className="inicial-abrigo-selo">
                                AMIGOS DE QUATRO PATAS
                            </span>

                            <h3>
                                Bem-vindo à nossa ONG
                            </h3>

                            <p>
                                Somos uma organização sem fins lucrativos
                                dedicada ao resgate, cuidado e adoção
                                responsável de cães e gatos. Nosso trabalho
                                conecta pessoas dispostas a ajudar a animais
                                que precisam de uma nova oportunidade.
                            </p>

                            <div className="inicial-abrigo-links">

                                <Link to="/PaginaSobreNos">
                                    Conheça nossa história
                                </Link>

                                <a href="#ajude-animais">
                                    Como ajudar
                                </a>

                            </div>
                        </div>

                        <div className="inicial-abrigo-imagem">
                            <img
                                src={abrigo}
                                alt="Animais acolhidos pela ONG"
                                loading="lazy"
                            />
                        </div>

                    </article>
                </section>

                <section
                    className="inicial-noticias"
                    aria-labelledby="noticias-titulo"
                >
                    <div className="inicial-secao-cabecalho inicial-noticias-cabecalho">

                        <div>
                            <span className="inicial-secao-etiqueta">
                                NOVIDADES
                            </span>

                            <h2 id="noticias-titulo">
                                Últimas notícias
                            </h2>
                        </div>

                        <Link
                            className="inicial-ver-todas"
                            to="/PaginaNoticias"
                        >
                            Ver todas as notícias →
                        </Link>

                    </div>

                    <div className="inicial-noticias-grade">

                        {noticias.slice(0, 3).map((noticia) => (
                            <article key={noticia.idNoticia}>

                                <div className="inicial-noticia-imagem-wrapper">

                                    {noticia.imagemNoticia ? (
                                        <img
                                            src={enderecoImagemNoticia(
                                                noticia.imagemNoticia
                                            )}
                                            alt={noticia.tituloNoticia}
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="inicial-noticia-sem-imagem">
                                            🐾
                                        </div>
                                    )}

                                    {noticia.dataPublicacao && (
                                        <time>
                                            {new Date(
                                                noticia.dataPublicacao
                                            ).toLocaleDateString("pt-BR")}
                                        </time>
                                    )}

                                </div>

                                <div className="inicial-noticia-conteudo">

                                    <h3>
                                        {noticia.tituloNoticia}
                                    </h3>

                                    <p>
                                        {noticia.descricaoNoticia?.slice(
                                            0,
                                            180
                                        )}

                                        {noticia.descricaoNoticia?.length > 180
                                            ? "..."
                                            : ""}
                                    </p>

                                    <Link to="/PaginaNoticias">
                                        Ler notícia →
                                    </Link>

                                </div>

                            </article>
                        ))}

                        {!noticias.length && (
                            <div className="inicial-noticias-vazio">
                                <span>📰</span>

                                <strong>
                                    Nenhuma notícia publicada
                                </strong>

                                <p>
                                    As novidades da ONG aparecerão aqui.
                                </p>
                            </div>
                        )}

                    </div>
                </section>

                <section
                    className="inicial-ajuda"
                    id="ajude-animais"
                    aria-labelledby="ajuda-titulo"
                >
                    <div className="inicial-contribuicao">

                        <div className="inicial-contribuicao-texto">

                            <span className="inicial-secao-etiqueta">
                                FAÇA PARTE
                            </span>

                            <h2 id="ajuda-titulo">
                                Ajude a manter esse cuidado
                            </h2>

                            <p>
                                Ração, medicamentos, atendimento veterinário
                                e acolhimento fazem parte da rotina da ONG.
                                Toda ajuda contribui para que mais animais
                                recebam o cuidado que precisam.
                            </p>

                            <button
                                className="inicial-doacao-principal"
                                type="button"
                                onClick={abrirDoacao}
                            >
                                Fazer uma doação
                            </button>

                        </div>

                        <img
                            src={abracoGato}
                            alt="Mulher abraçando um gato"
                            loading="lazy"
                        />

                    </div>
                </section>

            </main>

            <RodapeInstitucional />

            {doacaoAberta && (
                <div
                    className="doacao-modal-fundo"
                    onClick={fecharDoacao}
                >
                    <div
                        className="doacao-modal"
                        onClick={(evento) => evento.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="doacao-modal-fechar"
                            onClick={fecharDoacao}
                        >
                            ×
                        </button>

                        <span className="doacao-modal-etiqueta">
                            DOAÇÃO
                        </span>

                        <h2>
                            Ajude nossa ONG
                        </h2>

                        <p>
                            Escaneie o QR Code abaixo para simular
                            uma doação.
                        </p>

                        <div className="doacao-qrcode">
                            <QRCodeSVG
                                value={codigoDoacao}
                                size={210}
                                level="H"
                            />
                        </div>

                        <strong className="doacao-codigo">
                            {codigoDoacao}
                        </strong>

                        <small>
                            QR Code demonstrativo. Nenhum pagamento
                            real será realizado.
                        </small>

                    </div>
                </div>
            )}

        </section>
    );
}

export default PaginaInicial;