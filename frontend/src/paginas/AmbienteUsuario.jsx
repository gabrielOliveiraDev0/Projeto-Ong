import { API_URL } from "../servicos/api";
import { api } from "../servicos/api";
import { useAutenticacao } from "../servicos/contextoAutenticacao";
import { requisicao } from "../servicos/api";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import ImgExemplo from "../assets/ImgExemplo.png";
import Cabecalho from "../cabecalhos/CabecalhoPadrao";
import "../css/AmbienteUsuario.css";

function AmbienteUsuario() {

    const navigate = useNavigate();

    const { usuario: usuarioLogado, sair: encerrarSessao } = useAutenticacao();

    const [animais, setAnimais] = useState([]);
    const [solicitacoesAdocao, setSolicitacoesAdocao] = useState([]);
    const [favoritos, setFavoritos] = useState([]);
    const [solicitacoesPendentes, setSolicitacoesPendentes] = useState([]);

    const ehAdministrador =
        usuarioLogado?.tipoUsuario === "ADMINISTRADOR";

    const idUsuarioLogado = usuarioLogado?.idUsuario;
    const ehVeterinario = usuarioLogado?.tipoUsuario === "VETERINARIO";
    useEffect(() => {
        if (!idUsuarioLogado) return;
        let ativo = true, ocupado = false;
        async function atualizar() {
            if (ocupado) return;
            ocupado = true;
            try {
                const endpoints = ehAdministrador
                    ? ["/animais", "/adocoes/pendentes"]
                    : ehVeterinario
                    ? ["/animais"]
                    : [`/adocoes/usuario/${idUsuarioLogado}`, `/favoritos/usuario/${idUsuarioLogado}`];
                const resultados = await Promise.all(endpoints.map(url => api(url)));
                if (!ativo) return;
                if (ehAdministrador) {
                    setAnimais(resultados[0]);
                    setSolicitacoesPendentes(resultados[1]);
                } else if (ehVeterinario) {
                    setAnimais(resultados[0]);
                } else {
                    setSolicitacoesAdocao(resultados[0]);
                    setFavoritos(resultados[1]);
                }
            } catch(e) { console.error(e); } finally { ocupado = false; }
        }
        atualizar();
        const intervalo = setInterval(atualizar, 30000);
        return () => { ativo = false; clearInterval(intervalo); };
    }, [idUsuarioLogado, ehAdministrador, ehVeterinario]);

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

        encerrarSessao();

        navigate("/PaginaInicial");
    }

    async function removerFavorito(idAnimal) {

        try {

            const resposta = await requisicao(
                `/favoritos?idUsuario=${usuarioLogado.idUsuario}&idAnimal=${idAnimal}`,
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
            console.error("Erro ao remover favorito:", erro);
        }
    }

    async function responderSolicitacao(
        idSolicitacao,
        acao
    ) {

        const token = localStorage.getItem("token");

        try {

            const resposta = await requisicao(
                `/adocoes/${idSolicitacao}/${acao}`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!resposta.ok) {
                throw new Error(
                    "Erro ao responder solicitação"
                );
            }

            setSolicitacoesPendentes((atuais) =>
                atuais.filter(
                    (solicitacao) =>
                        solicitacao.idSolicitacao !==
                        idSolicitacao
                )
            );

            const respostaAnimais = await requisicao(
                "/animais"
            );

            if (respostaAnimais.ok) {

                const dadosAnimais =
                    await respostaAnimais.json();

                setAnimais(dadosAnimais);
            }

        } catch (erro) {

            console.error(
                "Erro ao responder solicitação:",
                erro
            );

            alert(
                "Não foi possível atualizar a solicitação."
            );
        }
    }

    async function abrirHolerite(idSolicitacao) {
        const janela = window.open("", "_blank");

        try {
            const resposta = await requisicao(
                `/adocoes/${idSolicitacao}/holerite`
            );

            if (!resposta.ok) {
                const erro = await resposta.json().catch(() => ({}));
                throw new Error(
                    erro.detail || erro.message || "Não foi possível abrir o holerite"
                );
            }

            const arquivo = await resposta.blob();
            const endereco = URL.createObjectURL(arquivo);

            if (janela) {
                janela.location.href = endereco;
            }

            setTimeout(() => URL.revokeObjectURL(endereco), 60000);
        } catch (erro) {
            if (janela) janela.close();
            alert(erro.message);
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

            const resposta = await requisicao(
                `/animais/${idAnimal}`,
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

            console.error(
                "Erro ao remover animal:",
                erro
            );

            alert(
                "Não foi possível remover o animal."
            );
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
                                    : ehVeterinario ? "Acompanhe os animais e atualize as informações veterinárias." : "Acompanhe suas adoções, solicitações e animais favoritos."}
                            </p>

                        </div>

                        {!ehAdministrador && !ehVeterinario && (

                            <button
                                className="botao-explorar"
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/PaginaVerAnimais"
                                    )
                                }
                            >
                                Ver animais
                            </button>

                        )}

                        {ehAdministrador && (

                            <button
                                className="botao-explorar"
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/CadastrarAnimais"
                                    )
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
                                    navigate(
                                        "/CadastrarAnimais"
                                    )
                                }
                            >
                                + Adicionar animal
                            </button>

                        </section>

                    )}

                    <section className="acoes-administrador">
                        <button onClick={() => navigate("/Chat")}>Chat</button>
                        {ehAdministrador && <><button onClick={() => navigate("/GerenciarUsuarios")}>Gerenciar usuários</button><button onClick={() => navigate("/Estoque")}>Estoque e alimentação</button><button onClick={() => navigate("/Relatorios")}>Relatórios</button><button onClick={() => navigate("/RelatorioAnimais")}>Relatório de animais</button><button onClick={() => navigate("/PaginaNoticias")}>Gerenciar notícias</button></>}
                        {(ehVeterinario || ehAdministrador) && <button onClick={() => navigate("/Veterinario")}>Atendimento veterinário</button>}
                    </section>
                    <section className="dashboard-listas">

                        {!ehAdministrador && !ehVeterinario && (
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
                                                        key={
                                                            solicitacao.idSolicitacao
                                                        }
                                                    >

                                                        <img
                                                            className="solicitacao-animal-imagem"
                                                            src={
                                                                solicitacao
                                                                    .animal
                                                                    .imagemAnimal
                                                                    ? `${API_URL}/uploads/animais/${solicitacao.animal.imagemAnimal}`
                                                                    : ImgExemplo
                                                            }
                                                            alt={`Imagem de ${solicitacao.animal.nomeAnimal}`}
                                                        />

                                                        <div className="solicitacao-animal-info">

                                                            <strong className="solicitacao-animal-nome">
                                                                {
                                                                    solicitacao
                                                                        .animal
                                                                        .nomeAnimal
                                                                }
                                                            </strong>

                                                            <span className="solicitacao-animal-tipo">
                                                                {
                                                                    solicitacao
                                                                        .animal
                                                                        .tipoAnimal
                                                                }
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
                                                        key={
                                                            solicitacao.idSolicitacao
                                                        }
                                                    >

                                                        <img
                                                            className="solicitacao-animal-imagem"
                                                            src={
                                                                solicitacao
                                                                    .animal
                                                                    .imagemAnimal
                                                                    ? `${API_URL}/uploads/animais/${solicitacao.animal.imagemAnimal}`
                                                                    : ImgExemplo
                                                            }
                                                            alt={`Imagem de ${solicitacao.animal.nomeAnimal}`}
                                                        />

                                                        <div className="solicitacao-animal-info">

                                                            <strong className="solicitacao-animal-nome">
                                                                {
                                                                    solicitacao
                                                                        .animal
                                                                        .nomeAnimal
                                                                }
                                                            </strong>

                                                            <span className="solicitacao-animal-tipo">
                                                                {
                                                                    solicitacao
                                                                        .animal
                                                                        .tipoAnimal
                                                                }
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
                                                Favorite animais para encontrá-los rapidamente depois.
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
                                                        key={
                                                            favorito.idFavorito
                                                        }
                                                    >

                                                        <img
                                                            className="solicitacao-animal-imagem"
                                                            src={
                                                                favorito
                                                                    .animal
                                                                    .imagemAnimal
                                                                    ? `${API_URL}/uploads/animais/${favorito.animal.imagemAnimal}`
                                                                    : ImgExemplo
                                                            }
                                                            alt={`Imagem de ${favorito.animal.nomeAnimal}`}
                                                        />

                                                        <div className="solicitacao-animal-info">

                                                            <strong className="solicitacao-animal-nome">
                                                                {
                                                                    favorito
                                                                        .animal
                                                                        .nomeAnimal
                                                                }
                                                            </strong>

                                                            <span className="solicitacao-animal-tipo">
                                                                {
                                                                    favorito
                                                                        .animal
                                                                        .tipoAnimal
                                                                }
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
                                                                            favorito
                                                                                .animal
                                                                                .idAnimal
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

                        {ehVeterinario && (
                            <>
                                <article className="painel-lista">
                                    <div className="painel-titulo">
                                        <div className="icone-painel">🩺</div>
                                        <div>
                                            <h2>Animais em tratamento</h2>
                                            <p>Animais que estão recebendo atendimento veterinário.</p>
                                        </div>
                                    </div>

                                    <div className="lista-animais-admin">
                                        {animais.filter(animal => animal.statusAnimal === "EM_TRATAMENTO").length === 0 ? (
                                            <div className="estado-vazio">
                                                <span>🩺</span>
                                                <strong>Nenhum animal em tratamento</strong>
                                            </div>
                                        ) : (
                                            animais
                                                .filter(animal => animal.statusAnimal === "EM_TRATAMENTO")
                                                .map(animal => (
                                                    <div className="animal-admin-item" key={animal.idAnimal}>
                                                        <img
                                                            className="animal-admin-imagem"
                                                            src={animal.imagemAnimal ? `${API_URL}/uploads/animais/${animal.imagemAnimal}` : ImgExemplo}
                                                            alt={animal.nomeAnimal}
                                                        />
                                                        <div className="animal-admin-conteudo">
                                                            <span className="animal-admin-id">ID #{animal.idAnimal}</span>
                                                            <strong>{animal.nomeAnimal}</strong>
                                                            <p>{animal.tipoAnimal}</p>
                                                            <p>Peso: {animal.pesoAnimal} kg</p>
                                                            <p>Status: EM TRATAMENTO</p>
                                                        </div>
                                                    </div>
                                                ))
                                        )}
                                    </div>
                                </article>

                                <article className="painel-lista">
                                    <div className="painel-titulo">
                                        <div className="icone-painel">🐾</div>
                                        <div>
                                            <h2>Animais resgatados</h2>
                                            <p>Animais recém-chegados que precisam de avaliação.</p>
                                        </div>
                                    </div>

                                    <div className="lista-animais-admin">
                                        {animais.filter(animal => animal.statusAnimal === "RESGATADO").length === 0 ? (
                                            <div className="estado-vazio">
                                                <span>🐾</span>
                                                <strong>Nenhum animal resgatado</strong>
                                            </div>
                                        ) : (
                                            animais
                                                .filter(animal => animal.statusAnimal === "RESGATADO")
                                                .map(animal => (
                                                    <div className="animal-admin-item" key={animal.idAnimal}>
                                                        <img
                                                            className="animal-admin-imagem"
                                                            src={animal.imagemAnimal ? `${API_URL}/uploads/animais/${animal.imagemAnimal}` : ImgExemplo}
                                                            alt={animal.nomeAnimal}
                                                        />
                                                        <div className="animal-admin-conteudo">
                                                            <span className="animal-admin-id">ID #{animal.idAnimal}</span>
                                                            <strong>{animal.nomeAnimal}</strong>
                                                            <p>{animal.tipoAnimal}</p>
                                                            <p>Peso: {animal.pesoAnimal} kg</p>
                                                            <p>Status: RESGATADO</p>
                                                        </div>
                                                    </div>
                                                ))
                                        )}
                                    </div>
                                </article>
                            </>
                        )}

                        {ehAdministrador && (
                            <>

                                <article className="painel-lista">

                                    <div className="painel-titulo">

                                        <div className="icone-painel">
                                            📋
                                        </div>

                                        <div>

                                            <h2>
                                                Solicitações de adoção
                                            </h2>

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

                                            {solicitacoesPendentes.map(
                                                (solicitacao) => (

                                                    <div
                                                        className="solicitacao-admin"
                                                        key={
                                                            solicitacao.idSolicitacao
                                                        }
                                                    >

                                                        <div className="solicitacao-admin-topo">

                                                            <img
                                                                className="solicitacao-animal-imagem"
                                                                src={
                                                                    solicitacao
                                                                        .animal
                                                                        .imagemAnimal
                                                                        ? `${API_URL}/uploads/animais/${solicitacao.animal.imagemAnimal}`
                                                                        : ImgExemplo
                                                                }
                                                                alt={`Imagem de ${solicitacao.animal.nomeAnimal}`}
                                                            />

                                                            <div>

                                                                <strong className="solicitacao-animal-nome">
                                                                    {
                                                                        solicitacao
                                                                            .animal
                                                                            .nomeAnimal
                                                                    }
                                                                </strong>

                                                                <p>
                                                                    {
                                                                        solicitacao
                                                                            .animal
                                                                            .tipoAnimal
                                                                    }
                                                                </p>

                                                                <span className="status-solicitacao status-pendente">
                                                                    PENDENTE
                                                                </span>

                                                            </div>

                                                        </div>

                                                        <div className="dados-solicitante">

                                                            <h3>
                                                                Solicitante
                                                            </h3>

                                                            <p>
                                                                <strong>
                                                                    Nome:
                                                                </strong>{" "}
                                                                {
                                                                    solicitacao
                                                                        .usuario
                                                                        .nomeUsuario
                                                                }
                                                            </p>

                                                            <p>
                                                                <strong>
                                                                    E-mail:
                                                                </strong>{" "}
                                                                {
                                                                    solicitacao
                                                                        .usuario
                                                                        .emailUsuario
                                                                }
                                                            </p>

                                                            <p>
                                                                <strong>
                                                                    Telefone:
                                                                </strong>{" "}
                                                                {
                                                                    solicitacao
                                                                        .usuario
                                                                        .telefoneUsuario ||
                                                                    "Não informado"
                                                                }
                                                            </p>

                                                        </div>

                                                        <div className="questionario-adocao">

                                                            <h3>
                                                                Questionário
                                                            </h3>

                                                            <p>
                                                                <strong>
                                                                    Moradia:
                                                                </strong>{" "}
                                                                {
                                                                    solicitacao.tipoMoradia
                                                                }
                                                            </p>

                                                            <p>
                                                                <strong>
                                                                    Residência permite animais:
                                                                </strong>{" "}
                                                                {
                                                                    solicitacao.residenciaPermiteAnimais
                                                                        ? "Sim"
                                                                        : "Não"
                                                                }
                                                            </p>

                                                            <p>
                                                                <strong>
                                                                    Possui outros animais:
                                                                </strong>{" "}
                                                                {
                                                                    solicitacao.possuiOutrosAnimais
                                                                        ? "Sim"
                                                                        : "Não"
                                                                }
                                                            </p>

                                                            <p>
                                                                <strong>
                                                                    Tempo sozinho:
                                                                </strong>{" "}
                                                                {
                                                                    solicitacao.tempoAnimalSozinho
                                                                }
                                                            </p>

                                                            <p>
                                                                <strong>
                                                                    Motivo:
                                                                </strong>{" "}
                                                                {
                                                                    solicitacao.motivoAdocao
                                                                }
                                                            </p>

                                                            <p>
                                                                <strong>
                                                                    Experiência:
                                                                </strong>{" "}
                                                                {
                                                                    solicitacao.experienciaComAnimais
                                                                }
                                                            </p>

                                                            <p>
                                                                <strong>
                                                                    Renda:
                                                                </strong>{" "}
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

                                                            {solicitacao.holeriteImagem && (
                                                                <button
                                                                    className="botao-ver-holerite"
                                                                    type="button"
                                                                    onClick={() =>
                                                                        abrirHolerite(
                                                                            solicitacao.idSolicitacao
                                                                        )
                                                                    }
                                                                >
                                                                    Ver holerite
                                                                </button>
                                                            )}

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

                                                )
                                            )}

                                        </div>

                                    )}

                                </article>

                                <article className="painel-lista">

                                    <div className="painel-titulo">

                                        <div className="icone-painel">
                                            +
                                        </div>

                                        <div>

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
                                                    ["RESGATADO", "EM_TRATAMENTO"].includes(animal.statusAnimal)
                                            )
                                            .map((animal) => (

                                                <div
                                                    className="animal-admin-item"
                                                    key={animal.idAnimal}
                                                >

                                                    <img
                                                        className="animal-admin-imagem"
                                                        src={
                                                            animal.imagemAnimal
                                                                ? `${API_URL}/uploads/animais/${animal.imagemAnimal}`
                                                                : ImgExemplo
                                                        }
                                                        alt={`Imagem de ${animal.nomeAnimal}`}
                                                    />

                                                    <div className="animal-admin-conteudo">

                                                        <span className="animal-admin-id">
                                                            ID #{animal.idAnimal}
                                                        </span>

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
                                                                removerAnimal(
                                                                    animal.idAnimal
                                                                )
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

                                                    <img
                                                        className="animal-admin-imagem"
                                                        src={
                                                            animal.imagemAnimal
                                                                ? `${API_URL}/uploads/animais/${animal.imagemAnimal}`
                                                                : ImgExemplo
                                                        }
                                                        alt={`Imagem de ${animal.nomeAnimal}`}
                                                    />

                                                    <div className="animal-admin-conteudo">

                                                        <span className="animal-admin-id">
                                                            ID #{animal.idAnimal}
                                                        </span>

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
                                                                removerAnimal(
                                                                    animal.idAnimal
                                                                )
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
                            {usuarioLogado.imagemPerfilUsuario ? (
                                <img
                                    src={`${API_URL}/uploads/perfis/${usuarioLogado.imagemPerfilUsuario}`}
                                    alt={`Foto de ${usuarioLogado.nomeUsuario}`}
                                />
                            ) : (
                                usuarioLogado.nomeUsuario
                                    ?.charAt(0)
                                    .toUpperCase()
                            )}
                        </div>

                        <h2>
                            {usuarioLogado.nomeUsuario}
                            {usuarioLogado.sobrenomeUsuario
                                ? ` ${usuarioLogado.sobrenomeUsuario}`
                                : ""}
                        </h2>

                        <span className="tipo-usuario">

                            {ehAdministrador
                                ? "Administrador"
                                : ehVeterinario ? "Veterinário" : "Usuário"}

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

                        <div className="informacao-item">
                            <span>Região</span>
                            <strong>
                                {usuarioLogado.regiaoUsuario || "Não informada"}
                            </strong>
                        </div>

                    </section>

                    <button
                        className="botao-editar-perfil"
                        type="button"
                        onClick={() => navigate("/EditarPerfil")}
                    >
                        Editar perfil
                    </button>

                    <section className="perfil-menu">

                        <button
                            type="button"
                            onClick={() => navigate("/Configuracoes")}
                        >
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