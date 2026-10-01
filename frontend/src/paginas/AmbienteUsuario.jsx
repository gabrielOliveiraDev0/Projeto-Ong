import { Navigate, useNavigate } from "react-router-dom";
import Cabecalho from "../cabecalhos/CabecalhoPadrao";
import "../css/AmbienteUsuario.css";

function AmbienteUsuario() {

    const navigate = useNavigate();

    const usuarioLogado = JSON.parse(
        localStorage.getItem("usuarioLogado")
    );

    if (!usuarioLogado) {
        return <Navigate to="/Login" replace />;
    }

    const ehAdministrador =
        usuarioLogado.tipoUsuario === "ADMINISTRADOR";

    function sair() {
        localStorage.removeItem("usuarioLogado");
        localStorage.removeItem("token");

        navigate("/PaginaInicial");
    }

    return (
        <>
            <Cabecalho />

            <main className="pagina-ambiente">

                <section className="dashboard">

                    <header className="dashboard-topo">

                        <div>
                            <p className="dashboard-subtitulo">
                                Minha conta
                            </p>

                            <h1>
                                Bem-vindo, {usuarioLogado.nomeUsuario}
                            </h1>

                            <p>
                                {ehAdministrador
                                    ? "Gerencie os animais e acompanhe as atividades da ONG."
                                    : "Acompanhe suas adoções, solicitações e animais favoritos."}
                            </p>
                        </div>

                        {!ehAdministrador && (
                            <button
                                className="botao-explorar"
                                type="button"
                                onClick={() => navigate("/PaginaVerAnimais")}
                            >
                                Explorar animais
                            </button>
                        )}

                        {ehAdministrador && (
                            <button
                                className="botao-explorar"
                                type="button"
                                onClick={() => navigate("/cadastrarAnimais")}
                            >
                                + Cadastrar animal
                            </button>
                        )}

                    </header>


                    {ehAdministrador && (
                        <section className="acoes-administrador">

                            <button
                                type="button"
                                onClick={() => navigate("/cadastrarAnimais")}
                            >
                                + Adicionar animal
                            </button>

                            <button type="button">
                                Editar animal
                            </button>

                            <button type="button">
                                Remover animal
                            </button>

                        </section>
                    )}


                    <section className="dashboard-listas">

                        {!ehAdministrador && (
                            <>
                                <article className="painel-lista">

                                    <div className="painel-titulo">
                                        <div className="icone-painel">
                                            ✓
                                        </div>

                                        <div>
                                            <h2>Animais adotados</h2>
                                            <p>
                                                Animais que já fazem parte da sua família.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="estado-vazio">
                                        <span>🐾</span>

                                        <strong>
                                            Nenhum animal adotado
                                        </strong>

                                        <p>
                                            Quando uma adoção for concluída,
                                            ela aparecerá aqui.
                                        </p>
                                    </div>

                                </article>


                                <article className="painel-lista">

                                    <div className="painel-titulo">
                                        <div className="icone-painel">
                                            ⏱
                                        </div>

                                        <div>
                                            <h2>Adoções solicitadas</h2>
                                            <p>
                                                Acompanhe o andamento das suas solicitações.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="estado-vazio">
                                        <span>📋</span>

                                        <strong>
                                            Nenhuma solicitação
                                        </strong>

                                        <p>
                                            As solicitações de adoção aparecerão aqui.
                                        </p>
                                    </div>

                                </article>


                                <article className="painel-lista">

                                    <div className="painel-titulo">
                                        <div className="icone-painel">
                                            ♥
                                        </div>

                                        <div>
                                            <h2>Favoritos</h2>
                                            <p>
                                                Animais que chamaram sua atenção.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="estado-vazio">
                                        <span>♡</span>

                                        <strong>
                                            Nenhum favorito
                                        </strong>

                                        <p>
                                            Favorite animais para encontrá-los
                                            rapidamente depois.
                                        </p>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate("/PaginaVerAnimais")
                                            }
                                        >
                                            Ver animais
                                        </button>
                                    </div>

                                </article>
                            </>
                        )}


                        {ehAdministrador && (
                            <>
                                <article className="painel-lista">

                                    <div className="painel-titulo">
                                        <div className="icone-painel">
                                            +
                                        </div>

                                        <div>
                                            <h2>Animais em tratamento</h2>
                                            <p>
                                                Animais ainda não disponíveis para adoção.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="estado-vazio">
                                        <span>🐾</span>
                                        <strong>Animais serão exibidos aqui</strong>
                                    </div>

                                </article>


                                <article className="painel-lista">

                                    <div className="painel-titulo">
                                        <div className="icone-painel">
                                            ✓
                                        </div>

                                        <div>
                                            <h2>Disponíveis para adoção</h2>
                                            <p>
                                                Animais atualmente disponíveis no site.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="estado-vazio">
                                        <span>🏠</span>
                                        <strong>Animais serão exibidos aqui</strong>
                                    </div>

                                </article>
                            </>
                        )}

                    </section>

                </section>


                <aside className="painel-perfil">

                    <section className="perfil-identidade">

                        <div className="avatar-usuario">
                            {usuarioLogado.nomeUsuario
                                ?.charAt(0)
                                .toUpperCase()}
                        </div>

                        <h2>
                            {usuarioLogado.nomeUsuario}
                        </h2>

                        <span className="tipo-usuario">
                            {ehAdministrador
                                ? "Administrador"
                                : "Usuário"}
                        </span>

                    </section>


                    <section className="perfil-informacoes">

                        <h3>Informações pessoais</h3>

                        <div className="informacao-item">
                            <span>Telefone</span>
                            <strong>
                                {usuarioLogado.telefoneUsuario || "Não informado"}
                            </strong>
                        </div>

                        <div className="informacao-item">
                            <span>E-mail</span>
                            <strong>
                                {usuarioLogado.emailUsuario}
                            </strong>
                        </div>

                    </section>


                    <button
                        className="botao-editar-perfil"
                        type="button"
                    >
                        Editar perfil
                    </button>


                    <section className="perfil-menu">

                        <button type="button">
                            ⚙ Configurações
                        </button>

                        <button
                            className="botao-sair-perfil"
                            type="button"
                            onClick={sair}
                        >
                            ↪ Sair da conta
                        </button>

                    </section>

                </aside>

            </main>
        </>
    );
}

export default AmbienteUsuario;