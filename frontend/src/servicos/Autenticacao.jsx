import { useEffect, useState } from "react";
import { requisicao } from "./api";
import { Contexto } from "./contextoAutenticacao";

export function Autenticacao({ children }) {
    const [usuario, setUsuario] = useState(() => {
        try {
            return localStorage.getItem("token")
                ? JSON.parse(localStorage.getItem("usuarioLogado"))
                : null;
        } catch {
            return null;
        }
    });

    const [carregando, setCarregando] = useState(
        !!localStorage.getItem("token")
    );

    function atualizarUsuario(dados) {
        localStorage.setItem("usuarioLogado", JSON.stringify(dados));
        setUsuario(dados);
    }

    function entrar(dados) {
        localStorage.setItem("token", dados.token);
        atualizarUsuario(dados.usuario);
        setCarregando(false);
    }

    function sair() {
        localStorage.removeItem("token");
        localStorage.removeItem("usuarioLogado");
        setUsuario(null);
        setCarregando(false);
    }

    useEffect(() => {
        let ativo = true;
        let ocupado = false;

        async function atualizar() {
            if (ocupado || !localStorage.getItem("token")) return;

            const tokenAtual = localStorage.getItem("token");
            ocupado = true;

            try {
                const resposta = await requisicao("/usuarios/me");

                if (!ativo || localStorage.getItem("token") !== tokenAtual) return;

                if (resposta.status === 401) {
                    sair();
                } else if (resposta.ok) {
                    const dados = await resposta.json();

                    if (ativo && localStorage.getItem("token") === tokenAtual) {
                        atualizarUsuario(dados);
                    }
                }
            } catch {
            } finally {
                ocupado = false;
                if (ativo) setCarregando(false);
            }
        }

        atualizar();
        const intervalo = setInterval(atualizar, 5000);

        return () => {
            ativo = false;
            clearInterval(intervalo);
        };
    }, []);

    return (
        <Contexto.Provider
            value={{
                usuario,
                carregando,
                entrar,
                sair,
                atualizarUsuario
            }}
        >
            {children}
        </Contexto.Provider>
    );
}
