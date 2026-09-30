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

            <main className="ambiente-usuario">

                <section className="ambiente-conteudo">

                    {ehAdministrador && (
                        <div className="acoes-administrador">

                            <button type="button">
                                Remover
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/cadastrarAnimais")}
                            >
                                + Adicionar
                            </button>

                        </div>
                    )}

                   <section className="listas-usuario">

    <div className="lista-principal">

        <h2>
            {ehAdministrador
                ? "Lista de animais em tratamento"
                : "Lista de animais adotados"}
        </h2>

        <p>
            Os animais serão exibidos aqui.
        </p>

    </div>

    {ehAdministrador && (
        <div className="lista-adocao">

            <h2>
                Lista de animais para adoção
            </h2>

            <p>
                Os animais disponíveis serão exibidos aqui.
            </p>

        </div>
    )}

    {!ehAdministrador && (
        <>
            <div className="lista-solicitacoes-adocao">

                <h2>
                    Lista de adoção solicitada
                </h2>

                <p>
                    Suas solicitações de adoção serão exibidas aqui.
                </p>

            </div>

            <div className="lista-favoritos">

                <h2>
                    Lista de favoritos
                </h2>

                <p>
                    Seus animais favoritos serão exibidos aqui.
                </p>

            </div>
        </>
    )}

</section>

                </section>

                <aside className="perfil-usuario">

                    <div className="perfil-cabecalho">

                        <div className="foto-perfil">
                            👤
                        </div>

                        <div>
                            <h2>
                                {usuarioLogado.nomeUsuario}
                            </h2>

                            <p>
                                {ehAdministrador
                                    ? "Administrador"
                                    : "Usuário"}
                            </p>
                        </div>

                    </div>

                    <div className="informacoes-usuario">

                        <h3>Suas informações</h3>

                        <p>
                            Telefone: {usuarioLogado.telefoneUsuario}
                        </p>

                        <p>
                            E-mail: {usuarioLogado.emailUsuario}
                        </p>

                    </div>

                    <div className="opcoes-usuario">

                        <button type="button">
                            Configurações
                        </button>

                        <button
                            type="button"
                            onClick={sair}
                        >
                            Sair da conta
                        </button>

                    </div>

                </aside>

            </main>
        </>
    );
}

export default AmbienteUsuario;