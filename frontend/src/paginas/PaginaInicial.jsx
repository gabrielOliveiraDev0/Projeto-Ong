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
    return imagem.startsWith("http://") || imagem.startsWith("https://")
        ? imagem
        : `http://localhost:8080/uploads/noticias/${imagem}`;
}

function PaginaInicial() {
    const { dados: noticias } = useConsulta("/noticias");
    const { dados: indicadores } = useConsulta("/indicadores", { adotados: 0, racaoKg: 0, disponiveis: 0 });
    return (
        <section className="pagina-inicial institucional">

            <Cabecalho />

            <main className="inicial-conteudo">
                <section className="inicial-hero" aria-labelledby="inicial-titulo">

                    <div className="inicial-hero-texto">
                        <h1 id="inicial-titulo">Ajude a encontrar um lar para animais</h1>
                        <div className="inicial-acoes">
                            <BotaoVerAnimais className="BoataoVeranimaisPaginaInicial" />
                            
                        </div>
                    </div>
                    <img className="inicial-hero-imagem" src={acolhimento} alt="Ilustração de uma mulher acolhendo um cachorro" width="3000" height="2000" />

                </section>

                <Indicadores dados={indicadores} />

                <section className="inicial-abrigos" aria-labelledby="abrigos-titulo">

                    <h2 id="abrigos-titulo">Os maiores abrigos</h2>
                    <article className="inicial-abrigo">
                        <div className="informacoes-ong">
                            <h3>Bem vindo a nossa ONG</h3>
                            <p>Somos uma organização sem fins lucrativos dedicada a ajudar animais em situação de vulnerabilidade. Nosso objetivo é proporcionar um lar seguro e amoroso para todos os animais que resgatamos, promovendo a adoção responsável e conscientizando a comunidade sobre a importância do cuidado com os animais.</p>

                            <div className="inicial-abrigo-links">
                                <Link to="/PaginaSobreNos">Leia mais</Link>
                                <a href="#ajude-animais">Para apoiar</a>
                            </div>

                        </div>
                        <img src={abrigo} alt="Ilustração de animais acolhidos em um abrigo" width="2000" height="2000" loading="lazy" />
                    </article>

                </section>

                <section className="inicial-noticias" aria-labelledby="noticias-titulo">

                    <h2 id="noticias-titulo">Notícias</h2>

                    <div className="inicial-noticias-grade">
                        {noticias.slice(0,3).map(n => <article key={n.idNoticia}><h3>{n.tituloNoticia}</h3>{n.imagemNoticia && <img src={enderecoImagemNoticia(n.imagemNoticia)} alt={n.tituloNoticia} loading="lazy" />}<time>{new Date(n.dataPublicacao).toLocaleDateString("pt-BR")}</time><p>{n.descricaoNoticia.slice(0,180)}</p><Link to="/PaginaNoticias">Saber mais →</Link></article>)}
                        {!noticias.length && <p>Nenhuma notícia publicada.</p>}
                    </div>

                </section>

                <section className="inicial-ajuda" id="ajude-animais" aria-labelledby="ajuda-titulo">

                    <h2 id="ajuda-titulo">Ajude os animais</h2>

                    <div className="inicial-contribuicao">
                        <h3>Junte-se à boa causa!</h3>
                        <img src={abracoGato} alt="Ilustração de uma mulher abraçando um gato" width="380" height="410" loading="lazy" />
                        <p>Sua ajuda é importante. Cada contribuição é um passo em direção a um mundo mais acolhedor e seguro para aqueles que não podem cuidar de si mesmos.</p>
                        <fieldset disabled aria-describedby="contribuicao-status">
                            <label htmlFor="contribuicao-visual">Valor da contribuição</label>
                            <input id="contribuicao-visual" type="text" placeholder="Valor da contribuição" />
                            <button type="button">Enviar</button>
                        </fieldset>
                        <small id="contribuicao-status">Contribuições online ainda não estão disponíveis.</small>
                    </div>
                    
                </section>

            </main>
            <RodapeInstitucional />
        </section>
    );
}

export default PaginaInicial;
