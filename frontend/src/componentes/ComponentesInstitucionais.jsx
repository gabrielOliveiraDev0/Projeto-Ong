import { Link } from "react-router-dom";
import "../css/Institucional.css";

function IconeImpacto({ tipo }) {
    return (
        <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {tipo === "pata" && <>
                <ellipse cx="17" cy="27" rx="7" ry="9" transform="rotate(-25 17 27)" />
                <ellipse cx="32" cy="16" rx="7" ry="9" />
                <ellipse cx="50" cy="18" rx="7" ry="9" transform="rotate(15 50 18)" />
                <ellipse cx="65" cy="31" rx="6" ry="8" transform="rotate(30 65 31)" />
                <path d="M21 62c-6-8 3-19 9-26 5-7 13-7 19 0 8 8 17 18 12 26-5 8-12 7-20 7s-15 1-20-7Z" />
            </>}
            {tipo === "apoio" && (
                <g
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                >
                    <path d="M10 38H70L64 61C63 66 59 69 54 69H26C21 69 17 66 16 61Z" />

                    <path d="M14 38C18 27 27 21 40 21C53 21 62 27 66 38" />

                    <circle cx="21" cy="31" r="3.5" fill="currentColor" stroke="none" />
                    <circle cx="27" cy="26" r="3.5" fill="currentColor" stroke="none" />
                    <circle cx="34" cy="23" r="3.5" fill="currentColor" stroke="none" />
                    <circle cx="41" cy="23" r="3.5" fill="currentColor" stroke="none" />
                    <circle cx="48" cy="24" r="3.5" fill="currentColor" stroke="none" />
                    <circle cx="55" cy="27" r="3.5" fill="currentColor" stroke="none" />
                    <circle cx="61" cy="32" r="3.5" fill="currentColor" stroke="none" />

                    <circle cx="25" cy="35" r="3.5" fill="currentColor" stroke="none" />
                    <circle cx="32" cy="31" r="3.5" fill="currentColor" stroke="none" />
                    <circle cx="39" cy="30" r="3.5" fill="currentColor" stroke="none" />
                    <circle cx="46" cy="31" r="3.5" fill="currentColor" stroke="none" />
                    <circle cx="53" cy="34" r="3.5" fill="currentColor" stroke="none" />

                    <circle cx="33" cy="51" r="2.5" />
                    <circle cx="38" cy="47" r="2.5" />
                    <circle cx="43" cy="47" r="2.5" />
                    <circle cx="48" cy="51" r="2.5" />

                    <path
                        d="
                M34 58
                C34 53 37 50 40 50
                C43 50 46 53 46 58
                C46 61 44 63 40 62
                C36 63 34 61 34 58
                Z
            "
                    />
                </g>
            )}

            {tipo === "lar" && <>
                <path d="m6 32 34-24 34 24M16 28v44h48V28" />
                <path d="M40 58 27 45c-10-11 6-23 13-10 8-13 23-1 13 10Z" />
            </>}
        </svg>
    );
}

function formatarNumero(valor, casas = 0) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        minimumFractionDigits: casas,
        maximumFractionDigits: casas
    });
}

export function Indicadores({ dados = {} }) {
    return (
        <section className="institucional-impacto" aria-label="Indicadores atualizados da ONG">
            <div className="institucional-indicadores">
                <article className="institucional-indicador">
                    <IconeImpacto tipo="pata" />
                    <strong>{formatarNumero(dados.adotados)}</strong>
                    <p>Animais que encontraram<br />um novo lar</p>
                </article>
                <article className="institucional-indicador">
                    <IconeImpacto tipo="apoio" />
                    <strong>{formatarNumero(dados.racaoKg, 1)} kg</strong>
                    <p>Ração disponível<br />no estoque da ONG</p>
                </article>
                <article className="institucional-indicador">
                    <IconeImpacto tipo="lar" />
                    <strong>{formatarNumero(dados.disponiveis)}</strong>
                    <p>Animais aguardando<br />um novo lar</p>
                </article>
            </div>
        </section>
    );
}

export function RodapeInstitucional() {
    return (
        <footer className="institucional-rodape">
            <nav aria-label="Navegação do rodapé">
                <span>Navegação</span>
                <Link to="/PaginaSobreNos">Sobre nós</Link>
                <Link to="/PaginaNoticias">Notícias</Link>
                <Link to="/PaginaVerAnimais">Encontrar animais</Link>
                <Link to="/CadastrarAnimais">Cadastrar animal</Link>
            </nav>
            <div><span>Amigos de quatro patas</span><p>Juntos por um lar seguro e cheio de amor.</p></div>
            <div><span>Faça parte</span><Link to="/CadastrarUsuarios">Cadastrar-se</Link><Link to="/Login">Entrar na conta</Link></div>
        </footer>
    );
}
