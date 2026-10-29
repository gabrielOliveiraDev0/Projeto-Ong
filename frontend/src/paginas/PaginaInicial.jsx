import { useConsulta } from "../servicos/useConsulta";
import { Link } from "react-router-dom";
import Cabecalho from "../cabecalhos/CabecalhoPadrao";
import { BotaoVerAnimais } from "../componentes/Botoes";
import { Indicadores, RodapeInstitucional } from "../componentes/ComponentesInstitucionais";
import acolhimento from "../assets/prototipo/acolhimento.gif";
import abrigo from "../assets/prototipo/abrigo.webp";
import abracoGato from "../assets/prototipo/abraco-gato.webp";
import "../css/PaginaInicial.css";

function enderecoImagemNoticia(imagem) {
    if (!imagem) return null;
    return `http://localhost:8080/uploads/noticias/${imagem}`;
}

function PaginaInicial() {
    const { dados: noticias } = useConsulta("/noticias");
    const { dados: indicadores } = useConsulta("/indicadores", {
        adotados: 0,
        racaoKg: 0,
        disponiveis: 0
    });

    return (
        <section className="pagina-inicial institucional">
            <Cabecalho />

            <main className="inicial-conteudo">
                <section className="inicial-hero" aria-labelledby="inicial-titulo">
                    <div className="inicial-hero-texto">
                        <span className="inicial-etiqueta">ADOÇÃO RESPONSÁVEL</span>
                        <h1 id="inicial-titulo">Um novo começo pode começar com uma adoção.</h1>
                        <p className="inicial-hero-descricao">
                            Conheça animais resgatados pela nossa ONG, acompanhe histórias de recuperação e encontre um novo amigo para fazer parte da sua família.
                        </p>

                        <div className="inicial-acoes">
                            <BotaoVerAnimais className="BoataoVeranimaisPaginaInicial" />
                            <Link className="inicial-botao-secundario" to="/PaginaSobreNos">
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
                            width="3000"
                            height="2000"
                        />
                        <div className="inicial-hero-card">
                            <strong>{Number(indicadores.disponiveis || 0).toLocaleString("pt-BR")}</strong>
                            <span>animais aguardando um lar</span>
                        </div>
                    </div>
                </section>

                <Indicadores dados={indicadores} />

                <section className="inicial-como-ajudamos" aria-labelledby="ajudamos-titulo">
                    <div className="inicial-secao-cabecalho">
                        <div>
                            <span className="inicial-secao-etiqueta">NOSSO TRABALHO</span>
                            <h2 id="ajudamos-titulo">Do resgate até um novo lar</h2>
                        </div>
                        <p>
                            Cada animal passa por um processo de acolhimento, cuidado e preparação antes de estar disponível para adoção.
                        </p>
                    </div>

                    <div className="inicial-etapas">
                        <article>
                            <span>01</span>
                            <div className="inicial-etapa-icone">🐾</div>
                            <h3>Resgate</h3>
                            <p>Recebemos e cadastramos animais resgatados em situação de vulnerabilidade.</p>
                        </article>
                        <article>
                            <span>02</span>
                            <div className="inicial-etapa-icone">🩺</div>
                            <h3>Cuidados</h3>
                            <p>O veterinário acompanha saúde, vacinação, castração e tratamentos necessários.</p>
                        </article>
                        <article>
                            <span>03</span>
                            <div className="inicial-etapa-icone">🏠</div>
                            <h3>Adoção</h3>
                            <p>Quando estiver pronto, o animal fica disponível para encontrar uma família responsável.</p>
                        </article>
                    </div>
                </section>

                <section className="inicial-abrigos" aria-labelledby="abrigos-titulo">
                    <div className="inicial-secao-cabecalho">
                        <div>
                            <span className="inicial-secao-etiqueta">QUEM SOMOS</span>
                            <h2 id="abrigos-titulo">Cuidado que transforma histórias</h2>
                        </div>
                    </div>

                    <article className="inicial-abrigo">
                        <div className="informacoes-ong">
                            <span className="inicial-abrigo-selo">AMIGOS DE QUATRO PATAS</span>
                            <h3>Bem-vindo à nossa ONG</h3>
                            <p>
                                Somos uma organização sem fins lucrativos dedicada ao resgate, cuidado e adoção responsável de cães e gatos. Nosso trabalho conecta pessoas dispostas a ajudar a animais que precisam de uma nova oportunidade.
                            </p>

                            <div className="inicial-abrigo-links">
                                <Link to="/PaginaSobreNos">Conheça nossa história</Link>
                                <a href="#ajude-animais">Como ajudar</a>
                            </div>
                        </div>
                        <div className="inicial-abrigo-imagem">
                            <img
                                src={abrigo}
                                alt="Ilustração de animais acolhidos em um abrigo"
                                width="2000"
                                height="2000"
                                loading="lazy"
                            />
                        </div>
                    </article>
                </section>

                <section className="inicial-noticias" aria-labelledby="noticias-titulo">
                    <div className="inicial-secao-cabecalho inicial-noticias-cabecalho">
                        <div>
                            <span className="inicial-secao-etiqueta">NOVIDADES</span>
                            <h2 id="noticias-titulo">Últimas notícias</h2>
                        </div>
                        <Link className="inicial-ver-todas" to="/PaginaNoticias">Ver todas as notícias →</Link>
                    </div>

                    <div className="inicial-noticias-grade">
                        {noticias.slice(0, 3).map((n) => (
                            <article key={n.idNoticia}>
                                <div className="inicial-noticia-imagem-wrapper">
                                    {n.imagemNoticia ? (
                                        <img
                                            src={enderecoImagemNoticia(n.imagemNoticia)}
                                            alt={n.tituloNoticia}
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="inicial-noticia-sem-imagem">🐾</div>
                                    )}
                                    <time>{new Date(n.dataPublicacao).toLocaleDateString("pt-BR")}</time>
                                </div>
                                <div className="inicial-noticia-conteudo">
                                    <h3>{n.tituloNoticia}</h3>
                                    <p>{n.descricaoNoticia.slice(0, 180)}{n.descricaoNoticia.length > 180 ? "..." : ""}</p>
                                    <Link to="/PaginaNoticias">Ler notícia →</Link>
                                </div>
                            </article>
                        ))}

                        {!noticias.length && (
                            <div className="inicial-noticias-vazio">
                                <span>📰</span>
                                <strong>Nenhuma notícia publicada</strong>
                                <p>As novidades da ONG aparecerão aqui.</p>
                            </div>
                        )}
                    </div>
                </section>

                <section className="inicial-ajuda" id="ajude-animais" aria-labelledby="ajuda-titulo">
                    <div className="inicial-contribuicao">
                        <div className="inicial-contribuicao-texto">
                            <span className="inicial-secao-etiqueta">FAÇA PARTE</span>
                            <h2 id="ajuda-titulo">Ajude a manter esse cuidado</h2>
                            <p>
                                Ração, medicamentos, atendimento veterinário e acolhimento fazem parte da rotina da ONG. Toda ajuda contribui para que mais animais recebam o cuidado que precisam.
                            </p>
                            <Link to="/PaginaSobreNos">Saiba como apoiar</Link>
                        </div>
                        <img
                            src={abracoGato}
                            alt="Ilustração de uma mulher abraçando um gato"
                            width="380"
                            height="410"
                            loading="lazy"
                        />
                    </div>
                </section>
            </main>

            <RodapeInstitucional />
        </section>
    );
}

export default PaginaInicial;
