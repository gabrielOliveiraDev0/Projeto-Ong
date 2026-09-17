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
            {tipo === "apoio" && <>
                <path d="M9 24h62v36H9zM10 35c8 0 12-4 12-11m37 0c0 7 4 11 12 11M9 49c8 0 12 4 12 11m39 0c0-7 4-11 11-11M16 17l8-10 12 8M63 67l-7 8-13-8" />
                <ellipse cx="40" cy="42" rx="10" ry="12" />
            </>}
            {tipo === "lar" && <>
                <path d="m6 32 34-24 34 24M16 28v44h48V28" />
                <path d="M40 58 27 45c-10-11 6-23 13-10 8-13 23-1 13 10Z" />
            </>}
        </svg>
    );
}

export function Indicadores({ valor = "65 641" }) {
    return (
        <section className="institucional-impacto" aria-label="Indicadores ilustrativos do protótipo">
            <div className="institucional-indicadores">
                <article className="institucional-indicador">
                    <IconeImpacto tipo="pata" />
                    <strong>1 456</strong>
                    <p>Os pequeninos<br />encontraram o seu lar</p>
                </article>
                <article className="institucional-indicador">
                    <IconeImpacto tipo="apoio" />
                    <strong>{valor} R$</strong>
                    <p>Coletado para servir<br />de alimento a animais</p>
                </article>
                <article className="institucional-indicador">
                    <IconeImpacto tipo="lar" />
                    <strong>48</strong>
                    <p>Aguardando um lar</p>
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
