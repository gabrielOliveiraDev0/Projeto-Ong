import { Link } from "react-router-dom";

export default function MenuRelatorios() {
    return <nav className="relatorio-acoes menu-relatorios" aria-label="Relatórios">
        <Link to="/Relatorios">Visão geral</Link>
        <Link to="/RelatorioMensal">Relatório mensal</Link>
        <Link to="/RelatorioAnimais">Relatório de animais</Link>
        <Link to="/Relatorios#relatorio-estoque">Relatório de estoque</Link>
    </nav>;
}
