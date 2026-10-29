import Cabecalho from "../cabecalhos/CabecalhoPadrao";
import { Indicadores, RodapeInstitucional } from "../componentes/ComponentesInstitucionais";
import { useConsulta } from "../servicos/useConsulta";
import logo from "../assets/logo.png";
import caoEGato from "../assets/prototipo/cao-e-gato.webp";
import gatoCurioso from "../assets/prototipo/gato-curioso.webp";
import caesCobertor from "../assets/prototipo/caes-cobertor.webp";
import "../css/PaginaSobreNos.css";

const etapas = [
    ["01", "Resgate", "O animal é acolhido, identificado e recebe uma ficha com suas principais informações."],
    ["02", "Tratamento", "A equipe veterinária acompanha saúde, vacinação, castração e necessidades de tratamento."],
    ["03", "Disponível", "Quando está apto, o animal passa a aparecer para pessoas interessadas em adoção."],
    ["04", "Novo lar", "Após a análise do formulário de interesse, a adoção é aprovada e o animal ganha uma nova família."]
];

function PaginaSobreNos() {
    const { dados: indicadores } = useConsulta("/indicadores", {
        adotados: 0,
        racaoKg: 0,
        disponiveis: 0
    });

    return (
        <section className="pagina-sobre-nos institucional">
            <Cabecalho />

            <main>
                <section className="sobre-hero" aria-labelledby="sobre-titulo">
                    <div className="sobre-hero-conteudo">
                        <img className="sobre-logo" src={logo} alt="Logo da ONG" />
                        <div>
                            <span className="sobre-etiqueta">Quem somos</span>
                            <h1 id="sobre-titulo">Amigos de quatro patas</h1>
                            <p>
                                Cuidamos de cães e gatos resgatados desde a chegada à ONG até o encontro com uma família responsável.
                            </p>
                        </div>
                    </div>
                    <img className="sobre-companheiros" src={caoEGato} alt="Um gato junto de um cachorro" />
                </section>

                <Indicadores dados={indicadores} />

                <section className="sobre-apresentacao">
                    <div className="sobre-apresentacao-texto">
                        <span className="sobre-etiqueta">Nossa missão</span>
                        <h2>Resgatar, cuidar e encontrar um novo lar</h2>
                        <p>
                            Somos uma organização sem fins lucrativos dedicada ao acolhimento de animais em situação de vulnerabilidade. Cada animal recebe acompanhamento individual, alimentação, cuidados veterinários e preparação para uma adoção responsável.
                        </p>
                        <p>
                            A tecnologia ajuda nossa equipe a manter fichas organizadas, acompanhar tratamentos, controlar o estoque de doações e tornar o processo de adoção mais seguro para todos.
                        </p>
                    </div>
                    <img src={gatoCurioso} alt="Gato acolhido pela ONG" />
                </section>

                <section className="sobre-fluxo">
                    <div className="sobre-secao-cabecalho">
                        <span className="sobre-etiqueta">Como trabalhamos</span>
                        <h2>Do resgate ao novo lar</h2>
                    </div>
                    <div className="sobre-etapas">
                        {etapas.map(([numero, titulo, texto]) => (
                            <article key={numero}>
                                <span>{numero}</span>
                                <h3>{titulo}</h3>
                                <p>{texto}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="sobre-compromissos">
                    <img src={caesCobertor} alt="Cães acolhidos pela ONG" />
                    <div>
                        <span className="sobre-etiqueta">Nossos compromissos</span>
                        <h2>Bem-estar em todas as etapas</h2>
                        <div className="sobre-compromissos-grade">
                            <article>
                                <strong>Saúde</strong>
                                <p>Acompanhamento veterinário, vacinação, castração e registro de tratamentos.</p>
                            </article>
                            <article>
                                <strong>Alimentação</strong>
                                <p>Controle de ração e consumo para manter o abastecimento adequado dos animais acolhidos.</p>
                            </article>
                            <article>
                                <strong>Adoção responsável</strong>
                                <p>Análise do perfil do interessado antes da aprovação de cada adoção.</p>
                            </article>
                            <article>
                                <strong>Transparência</strong>
                                <p>Organização de estoque, movimentações e informações dos animais dentro do sistema.</p>
                            </article>
                        </div>
                    </div>
                </section>
            </main>

            <RodapeInstitucional />
        </section>
    );
}

export default PaginaSobreNos;
