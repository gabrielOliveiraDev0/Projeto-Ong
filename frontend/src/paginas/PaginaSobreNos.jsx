import Cabecalho from "../cabecalhos/CabecalhoPadrao";
import { Indicadores } from "./ComponentesInstitucionais";
import logo from "../assets/logo.png";
import caoEGato from "../assets/prototipo/cao-e-gato.webp";
import gatoCurioso from "../assets/prototipo/gato-curioso.webp";
import caesCobertor from "../assets/prototipo/caes-cobertor.webp";
import "../css/PaginaSobreNos.css";

function PaginaSobreNos() {
    return (
        <section className="pagina-sobre-nos institucional">
            <Cabecalho />
            <main>
                <section className="sobre-hero" aria-labelledby="sobre-titulo">
                    <img className="sobre-logo" src={logo} alt="Logo da ONG" width="300" height="300" />
                    <h1 id="sobre-titulo"><span>Sobre Nós</span>Amigos de quatro patas</h1>
                    <img className="sobre-companheiros" src={caoEGato} alt="Um gatinho junto de um cachorro" width="462" height="540" />
                </section>
                <Indicadores valor="65 648" />
                <section className="sobre-missao" aria-label="Nossa missão">
                    <img className="sobre-gato" src={gatoCurioso} alt="" width="587" height="425" loading="lazy" />
                    <div className="sobre-missao-texto">
                        <p>Somos uma organização sem fins lucrativos dedicada a ajudar animais em situação de vulnerabilidade. Nosso objetivo é proporcionar um lar seguro e amoroso para todos os animais que resgatamos, promovendo a adoção responsável e conscientizando a comunidade sobre a importância do cuidado com os animais.</p>
                        <p>Nossa equipe é composta por voluntários apaixonados por animais, que trabalham incansavelmente para resgatar, cuidar e encontrar lares permanentes para os animais necessitados. Acreditamos que todos os animais merecem amor, respeito e uma chance de viver uma vida feliz.</p>
                    </div>
                    <img className="sobre-caes" src={caesCobertor} alt="" width="500" height="500" loading="lazy" />
                </section>
            </main>
        </section>
    );
}
export default PaginaSobreNos;
