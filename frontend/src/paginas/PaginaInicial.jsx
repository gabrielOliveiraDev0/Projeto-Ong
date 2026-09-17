import { Link } from "react-router-dom";
import Cabecalho from "../cabecalhos/CabecalhoPadrao";
import { BotaoCadastrarAnimal, BotaoVerAnimais } from "../componentes/Botoes";
import { Indicadores, RodapeInstitucional } from "./ComponentesInstitucionais";
import acolhimento from "../assets/prototipo/acolhimento.webp";
import abrigo from "../assets/prototipo/abrigo.webp";
import noticiaGato from "../assets/prototipo/noticia-gato.webp";
import noticiaDescanso from "../assets/prototipo/noticia-descanso.webp";
import noticiaAmigos from "../assets/prototipo/noticia-amigos.webp";
import abracoGato from "../assets/prototipo/abraco-gato.webp";
import "../css/PaginaInicial.css";

function PaginaInicial() {
    return (
        <section className="pagina-inicial institucional">
            <Cabecalho />
            <main className="inicial-conteudo">
                <section className="inicial-hero" aria-labelledby="inicial-titulo">
                    <div className="inicial-hero-texto">
                        <h1 id="inicial-titulo">Ajude a encontrar um lar para animais</h1>
                        <div className="inicial-acoes">
                            <BotaoVerAnimais className="BoataoVeranimaisPaginaInicial" />
                            <BotaoCadastrarAnimal />
                        </div>
                    </div>
                    <img className="inicial-hero-imagem" src={acolhimento} alt="Ilustração de uma mulher acolhendo um cachorro" width="3000" height="2000" />
                </section>
                <Indicadores />
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
                        <article>
                            <h3>Gato teve uma mãe.</h3>
                            <img src={noticiaGato} alt="Vitral colorido com o retrato de um gato" width="300" height="300" loading="lazy" />
                            <time dateTime="2024-02-02">02.02.2024</time>
                            <p>Os alunos do grupo PZ-12 decidiram criar um novo site para o departamento de software.</p>
                            <Link to="/PaginaNoticias">Saber mais <span aria-hidden="true">→</span></Link>
                        </article>
                        <article>
                            <h3>Gato deitado</h3>
                            <img src={noticiaDescanso} alt="Ilustração de gatos descansando em uma poltrona" width="800" height="800" loading="lazy" />
                            <time dateTime="2023-11-30">30 de novembro de 2023</time>
                            <p>Os alunos do grupo PZ-12 decidiram criar um novo site para o departamento de software.</p>
                            <Link to="/PaginaNoticias">Saber mais <span aria-hidden="true">→</span></Link>
                        </article>
                        <article>
                            <h3>Inseparáveis</h3>
                            <img src={noticiaAmigos} alt="Um cachorro e um gato juntos" width="724" height="345" loading="lazy" />
                            <time dateTime="2024-02-02">2 de fevereiro de 2024</time>
                            <p>Os alunos do grupo PZ-12 decidiram criar um novo site para o departamento de software.</p>
                            <Link to="/PaginaNoticias">Saber mais <span aria-hidden="true">→</span></Link>
                        </article>
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
