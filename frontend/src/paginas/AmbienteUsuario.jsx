import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import ImgExemplo from "../assets/ImgExemplo.png";
import Cabecalho from "../cabecalhos/CabecalhoPadrao";
import "../css/AmbienteUsuario.css";

function AmbienteUsuario() {

    const navigate = useNavigate();

    const usuarioLogado = JSON.parse(
        localStorage.getItem("usuarioLogado")
    );

    const [animais, setAnimais] = useState([]);
    const [solicitacoesAdocao, setSolicitacoesAdocao] = useState([]);
    const [favoritos, setFavoritos] = useState([]);
    const [solicitacoesPendentes, setSolicitacoesPendentes] = useState([]);

    const ehAdministrador =
        usuarioLogado?.tipoUsuario === "ADMINISTRADOR";

    useEffect(() => {

        if (!ehAdministrador) {
            return;
        }

        fetch("http://localhost:8080/animais")
            .then((resposta) => {

                if (!resposta.ok) {
                    throw new Error("Erro ao buscar animais");
                }

                return resposta.json();
            })
            .then((dados) => {
                setAnimais(dados);
            })
            .catch((erro) => {
                console.error("Erro ao buscar animais:", erro);
            });

    }, [ehAdministrador]);

    useEffect(() => {

        if (!usuarioLogado || ehAdministrador) {
            return;
        }

        fetch(
            `http://localhost:8080/adocoes/usuario/${usuarioLogado.idUsuario}`
        )
            .then((resposta) => {

                if (!resposta.ok) {
                    throw new Error("Erro ao buscar solicitações");
                }

                return resposta.json();
            })
            .then((dados) => {
                setSolicitacoesAdocao(dados);
            })
            .catch((erro) => {
                console.error(
                    "Erro ao buscar solicitações:",
                    erro
                );
            });

    }, [usuarioLogado?.idUsuario, ehAdministrador]);

    useEffect(() => {

        if (!usuarioLogado || ehAdministrador) {
            return;
        }

        fetch(
            `http://localhost:8080/favoritos/usuario/${usuarioLogado.idUsuario}`
        )
            .then((resposta) => {

                if (!resposta.ok) {
                    throw new Error("Erro ao buscar favoritos");
                }

                return resposta.json();
            })
            .then((dados) => {
                setFavoritos(dados);
            })
            .catch((erro) => {
                console.error(
                    "Erro ao buscar favoritos:",
                    erro
                );
            });

    }, [usuarioLogado?.idUsuario, ehAdministrador]);
    useEffect(() => {

        if (!usuarioLogado || !ehAdministrador) {
            return;
        }

        const token = localStorage.getItem("token");

        fetch("http://localhost:8080/adocoes/pendentes", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((resposta) => {

                if (!resposta.ok) {
                    throw new Error("Erro ao buscar solicitações pendentes");
                }

                return resposta.json();
            })
            .then((dados) => {
                setSolicitacoesPendentes(dados);
            })
            .catch((erro) => {
                console.error(
                    "Erro ao buscar solicitações pendentes:",
                    erro
                );
            });

    }, [usuarioLogado?.idUsuario, ehAdministrador]);

    if (!usuarioLogado) {
        return <Navigate to="/Login" replace />;
    }

    const animaisAdotados = solicitacoesAdocao.filter(
        (solicitacao) =>
            solicitacao.statusSolicitacao === "APROVADA"
    );

    const solicitacoesEmAndamento = solicitacoesAdocao.filter(
        (solicitacao) =>
            solicitacao.statusSolicitacao !== "APROVADA"
    );

    function sair() {

        localStorage.removeItem("usuarioLogado");
        localStorage.removeItem("token");

        navigate("/PaginaInicial");
    }

    async function removerFavorito(idAnimal) {

        try {

            const resposta = await fetch(
                `http://localhost:8080/favoritos?idUsuario=${usuarioLogado.idUsuario}&idAnimal=${idAnimal}`,
                {
                    method: "DELETE"
                }
            );

            if (!resposta.ok) {
                throw new Error("Erro ao remover favorito");
            }

            setFavoritos((favoritosAtuais) =>
                favoritosAtuais.filter(
                    (favorito) =>
                        favorito.animal.idAnimal !== idAnimal
                )
            );

        } catch (erro) {

            console.error(
                "Erro ao remover favorito:",
                erro
            );
        }
    }
    async function responderSolicitacao(idSolicitacao, acao) {

        const token = localStorage.getItem("token");

        try {

            const resposta = await fetch(
                `http://localhost:8080/adocoes/${idSolicitacao}/${acao}`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!resposta.ok) {
                throw new Error("Erro ao responder solicitação");
            }

            setSolicitacoesPendentes((atuais) =>
                atuais.filter(
                    (solicitacao) =>
                        solicitacao.idSolicitacao !== idSolicitacao
                )
            );

            const respostaAnimais = await fetch(
                "http://localhost:8080/animais"
            );

            if (respostaAnimais.ok) {
                const dadosAnimais = await respostaAnimais.json();
                setAnimais(dadosAnimais);
            }

        } catch (erro) {

            console.error(
                "Erro ao responder solicitação:",
                erro
            );

            alert("Não foi possível atualizar a solicitação.");
        }
    }
    async function removerAnimal(idAnimal) {

        const confirmar = window.confirm(
            "Deseja realmente remover este animal?"
        );

        if (!confirmar) {
            return;
        }

        const token = localStorage.getItem("token");

        try {

            const resposta = await fetch(
                `http://localhost:8080/animais/${idAnimal}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!resposta.ok) {
                throw new Error("Erro ao remover animal");
            }

            setAnimais((animaisAtuais) =>
                animaisAtuais.filter(
                    (animal) =>
                        animal.idAnimal !== idAnimal
                )
            );

        } catch (erro) {

            console.error(erro);

            alert("Não foi possível remover o animal.");
        }
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
                                onClick={() =>
                                    navigate("/PaginaVerAnimais")
                                }
                            >
                                Explorar animais
                            </button>

                        )}

                        {ehAdministrador && (

                            <button
                                className="botao-explorar"
                                type="button"
                                onClick={() =>
                                    navigate("/cadastrarAnimais")
                                }
                            >
                                + Cadastrar animal
                            </button>

                        )}

                    </header>

                    {ehAdministrador && (

                        <section className="acoes-administrador">

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/cadastrarAnimais")
                                }
                            >
                                + Adicionar animal
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

                                            <h2>
                                                Animais adotados
                                            </h2>

                                            <p>
                                                Animais que já fazem parte da sua família.
                                            </p>

                                        </div>

                                    </div>

                                    {animaisAdotados.length === 0 ? (

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

                                    ) : (

                                        <div className="lista-solicitacoes">

                                            {animaisAdotados.map(
                                                (solicitacao) => (

                                                    <div
                                                        className="solicitacao-item"
                                                        key={solicitacao.idSolicitacao}
                                                    >

                                                        <img
                                                            className="solicitacao-animal-imagem"
                                                            src={
                                                                solicitacao.animal.imagemAnimal
                                                                    ? `http://localhost:8080/uploads/animais/${solicitacao.animal.imagemAnimal}`
                                                                    : ImgExemplo
                                                            }
                                                            alt={`Imagem de ${solicitacao.animal.nomeAnimal}`}
                                                        />

                                                        <div className="solicitacao-animal-info">

                                                            <strong className="solicitacao-animal-nome">
                                                                {solicitacao.animal.nomeAnimal}
                                                            </strong>

                                                            <span className="solicitacao-animal-tipo">
                                                                {solicitacao.animal.tipoAnimal}
                                                            </span>

                                                            <span className="status-solicitacao status-aprovada">
                                                                ADOTADO
                                                            </span>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/DetalhesAnimais/${solicitacao.animal.idAnimal}`
                                                                    )
                                                                }
                                                            >
                                                                Ver animal
                                                            </button>

                                                        </div>

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    )}

                                </article>

                                <article className="painel-lista">

                                    <div className="painel-titulo">

                                        <div className="icone-painel">
                                            ⏱
                                        </div>

                                        <div>

                                            <h2>
                                                Adoções solicitadas
                                            </h2>

                                            <p>
                                                Acompanhe o andamento das suas solicitações.
                                            </p>

                                        </div>

                                    </div>

                                    {solicitacoesEmAndamento.length === 0 ? (

                                        <div className="estado-vazio">

                                            <span>📋</span>

                                            <strong>
                                                Nenhuma solicitação
                                            </strong>

                                            <p>
                                                As solicitações de adoção aparecerão aqui.
                                            </p>

                                        </div>

                                    ) : (

                                        <div className="lista-solicitacoes">

                                            {solicitacoesEmAndamento.map(
                                                (solicitacao) => (

                                                    <div
                                                        className="solicitacao-item"
                                                        key={solicitacao.idSolicitacao}
                                                    >

                                                        <img
                                                            className="solicitacao-animal-imagem"
                                                            src={
                                                                solicitacao.animal.imagemAnimal
                                                                    ? `http://localhost:8080/uploads/animais/${solicitacao.animal.imagemAnimal}`
                                                                    : ImgExemplo
                                                            }
                                                            alt={`Imagem de ${solicitacao.animal.nomeAnimal}`}
                                                        />

                                                        <div className="solicitacao-animal-info">

                                                            <strong className="solicitacao-animal-nome">
                                                                {solicitacao.animal.nomeAnimal}
                                                            </strong>

                                                            <span className="solicitacao-animal-tipo">
                                                                {solicitacao.animal.tipoAnimal}
                                                            </span>

                                                            <span
                                                                className={
                                                                    `status-solicitacao status-${(
                                                                        solicitacao.statusSolicitacao ||
                                                                        "PENDENTE"
                                                                    ).toLowerCase()}`
                                                                }
                                                            >
                                                                {
                                                                    solicitacao.statusSolicitacao ||
                                                                    "PENDENTE"
                                                                }
                                                            </span>

                                                        </div>

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    )}

                                </article>

                                <article className="painel-lista">

                                    <div className="painel-titulo">

                                        <div className="icone-painel">
                                            ♥
                                        </div>

                                        <div>

                                            <h2>
                                                Favoritos
                                            </h2>

                                            <p>
                                                Animais que chamaram sua atenção.
                                            </p>

                                        </div>

                                    </div>

                                    {favoritos.length === 0 ? (

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
                                                    navigate(
                                                        "/PaginaVerAnimais"
                                                    )
                                                }
                                            >
                                                Ver animais
                                            </button>

                                        </div>

                                    ) : (

                                        <div className="lista-solicitacoes">

                                            {favoritos.map(
                                                (favorito) => (

                                                    <div
                                                        className="solicitacao-item"
                                                        key={favorito.idFavorito}
                                                    >

                                                        <img
                                                            className="solicitacao-animal-imagem"
                                                            src={
                                                                favorito.animal.imagemAnimal
                                                                    ? `http://localhost:8080/uploads/animais/${favorito.animal.imagemAnimal}`
                                                                    : ImgExemplo
                                                            }
                                                            alt={`Imagem de ${favorito.animal.nomeAnimal}`}
                                                        />

                                                        <div className="solicitacao-animal-info">

                                                            <strong className="solicitacao-animal-nome">
                                                                {favorito.animal.nomeAnimal}
                                                            </strong>

                                                            <span className="solicitacao-animal-tipo">
                                                                {favorito.animal.tipoAnimal}
                                                            </span>

                                                            <div className="favorito-acoes">

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        navigate(
                                                                            `/DetalhesAnimais/${favorito.animal.idAnimal}`
                                                                        )
                                                                    }
                                                                >
                                                                    Ver animal
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        removerFavorito(
                                                                            favorito.animal.idAnimal
                                                                        )
                                                                    }
                                                                >
                                                                    Remover
                                                                </button>

                                                            </div>

                                                        </div>

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    )}

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
                                            <article className="painel-lista">

                                                <div className="painel-titulo">

                                                    <div className="icone-painel">
                                                        📋
                                                    </div>

                                                    <div>
                                                        <h2>Solicitações de adoção</h2>

                                                        <p>
                                                            Analise as solicitações enviadas pelos usuários.
                                                        </p>
                                                    </div>

                                                </div>

                                                {solicitacoesPendentes.length === 0 ? (

                                                    <div className="estado-vazio">

                                                        <span>✓</span>

                                                        <strong>
                                                            Nenhuma solicitação pendente
                                                        </strong>

                                                        <p>
                                                            Novas solicitações aparecerão aqui.
                                                        </p>

                                                    </div>

                                                ) : (

                                                    <div className="lista-solicitacoes-admin">

                                                        {solicitacoesPendentes.map((solicitacao) => (

                                                            <div
                                                                className="solicitacao-admin"
                                                                key={solicitacao.idSolicitacao}
                                                            >

                                                                <div className="solicitacao-admin-topo">

                                                                    <img
                                                                        className="solicitacao-animal-imagem"
                                                                        src={
                                                                            solicitacao.animal.imagemAnimal
                                                                                ? `http://localhost:8080/uploads/animais/${solicitacao.animal.imagemAnimal}`
                                                                                : ImgExemplo
                                                                        }
                                                                        alt={`Imagem de ${solicitacao.animal.nomeAnimal}`}
                                                                    />

                                                                    <div>

                                                                        <strong className="solicitacao-animal-nome">
                                                                            {solicitacao.animal.nomeAnimal}
                                                                        </strong>

                                                                        <p>
                                                                            {solicitacao.animal.tipoAnimal}
                                                                        </p>

                                                                        <span className="status-solicitacao status-pendente">
                                                                            PENDENTE
                                                                        </span>

                                                                    </div>

                                                                </div>

                                                                <div className="dados-solicitante">

                                                                    <h3>Solicitante</h3>

                                                                    <p>
                                                                        <strong>Nome:</strong>{" "}
                                                                        {solicitacao.usuario.nomeUsuario}
                                                                    </p>

                                                                    <p>
                                                                        <strong>E-mail:</strong>{" "}
                                                                        {solicitacao.usuario.emailUsuario}
                                                                    </p>

                                                                    <p>
                                                                        <strong>Telefone:</strong>{" "}
                                                                        {solicitacao.usuario.telefoneUsuario ||
                                                                            "Não informado"}
                                                                    </p>

                                                                </div>

                                                                <div className="questionario-adocao">

                                                                    <h3>Questionário</h3>

                                                                    <p>
                                                                        <strong>Moradia:</strong>{" "}
                                                                        {solicitacao.tipoMoradia}
                                                                    </p>

                                                                    <p>
                                                                        <strong>
                                                                            Residência permite animais:
                                                                        </strong>{" "}
                                                                        {solicitacao.residenciaPermiteAnimais
                                                                            ? "Sim"
                                                                            : "Não"}
                                                                    </p>

                                                                    <p>
                                                                        <strong>
                                                                            Possui outros animais:
                                                                        </strong>{" "}
                                                                        {solicitacao.possuiOutrosAnimais
                                                                            ? "Sim"
                                                                            : "Não"}
                                                                    </p>

                                                                    <p>
                                                                        <strong>
                                                                            Tempo que o animal ficará sozinho:
                                                                        </strong>{" "}
                                                                        {solicitacao.tempoAnimalSozinho}
                                                                    </p>

                                                                    <p>
                                                                        <strong>Motivo da adoção:</strong>{" "}
                                                                        {solicitacao.motivoAdocao}
                                                                    </p>

                                                                    <p>
                                                                        <strong>
                                                                            Experiência com animais:
                                                                        </strong>{" "}
                                                                        {solicitacao.experienciaComAnimais}
                                                                    </p>

                                                                    <p>
                                                                        <strong>Renda mensal:</strong>{" "}
                                                                        {Number(
                                                                            solicitacao.rendaMensal
                                                                        ).toLocaleString(
                                                                            "pt-BR",
                                                                            {
                                                                                style: "currency",
                                                                                currency: "BRL"
                                                                            }
                                                                        )}
                                                                    </p>

                                                                </div>

                                                                <div className="acoes-solicitacao">

                                                                    <button
                                                                        className="botao-aprovar"
                                                                        type="button"
                                                                        onClick={() =>
                                                                            responderSolicitacao(
                                                                                solicitacao.idSolicitacao,
                                                                                "aprovar"
                                                                            )
                                                                        }
                                                                    >
                                                                        Aprovar
                                                                    </button>

                                                                    <button
                                                                        className="botao-recusar"
                                                                        type="button"
                                                                        onClick={() =>
                                                                            responderSolicitacao(
                                                                                solicitacao.idSolicitacao,
                                                                                "recusar"
                                                                            )
                                                                        }
                                                                    >
                                                                        Recusar
                                                                    </button>

                                                                </div>

                                                            </div>

                                                        ))}

                                                    </div>

                                                )}

                                            </article>

                                            <h2>
                                                Animais em tratamento
                                            </h2>

                                            <p>
                                                Animais ainda não disponíveis para adoção.
                                            </p>

                                        </div>

                                    </div>

                                    <div className="lista-animais-admin">

                                        {animais
                                            .filter(
                                                (animal) =>
                                                    animal.statusAnimal !==
                                                    "DISPONIVEL"
                                            )
                                            .map((animal) => (

                                                <div
                                                    className="animal-admin-item"
                                                    key={animal.idAnimal}
                                                >

                                                    <div>

                                                        <strong>
                                                            {animal.nomeAnimal}
                                                        </strong>

                                                        <p>
                                                            {animal.tipoAnimal}
                                                        </p>

                                                        <p>
                                                            Status:{" "}
                                                            {animal.statusAnimal}
                                                        </p>

                                                    </div>

                                                    <div className="acoes-animal-admin">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/EditarAnimal/${animal.idAnimal}`
                                                                )
                                                            }
                                                        >
                                                            Editar
                                                        </button>

                                                        <button
                                                            className="botao-remover-animal"
                                                            type="button"
                                                            onClick={() =>
                                                                removerAnimal(animal.idAnimal)
                                                            }
                                                        >
                                                            Remover
                                                        </button>

                                                    </div>

                                                </div>

                                            ))}

                                    </div>

                                </article>

                                <article className="painel-lista">

                                    <div className="painel-titulo">

                                        <div className="icone-painel">
                                            ✓
                                        </div>

                                        <div>

                                            <h2>
                                                Disponíveis para adoção
                                            </h2>

                                            <p>
                                                Animais atualmente disponíveis no site.
                                            </p>

                                        </div>

                                    </div>

                                    <div className="lista-animais-admin">

                                        {animais
                                            .filter(
                                                (animal) =>
                                                    animal.statusAnimal ===
                                                    "DISPONIVEL"
                                            )
                                            .map((animal) => (

                                                <div
                                                    className="animal-admin-item"
                                                    key={animal.idAnimal}
                                                >

                                                    <div>

                                                        <strong>
                                                            {animal.nomeAnimal}
                                                        </strong>

                                                        <p>
                                                            {animal.tipoAnimal}
                                                        </p>

                                                    </div>

                                                    <div className="acoes-animal-admin">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/EditarAnimal/${animal.idAnimal}`
                                                                )
                                                            }
                                                        >
                                                            Editar
                                                        </button>

                                                        <button
                                                            className="botao-remover-animal"
                                                            type="button"
                                                            onClick={() =>
                                                                removerAnimal(animal.idAnimal)
                                                            }
                                                        >
                                                            Remover
                                                        </button>

                                                    </div>

                                                </div>

                                            ))}

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

                        <h3>
                            Informações pessoais
                        </h3>

                        <div className="informacao-item">

                            <span>
                                Telefone
                            </span>

                            <strong>
                                {usuarioLogado.telefoneUsuario ||
                                    "Não informado"}
                            </strong>

                        </div>

                        <div className="informacao-item">

                            <span>
                                E-mail
                            </span>

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