import { useEffect, useRef, useState, useCallback } from "react";
import { api } from "./api";
export function useConsulta(url, inicial = []) {
    const [dados, setDados] = useState(inicial);
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(true);
    const versao = useRef(0);
    const atualizar = useCallback(async () => {
        if (!url) { setCarregando(false); return; }
        const atual = ++versao.current;
        try { const resultado = await api(url); if (atual === versao.current) { setDados(resultado); setErro(""); } }
        catch (e) { if (atual === versao.current) setErro(e.message); }
        finally { if (atual === versao.current) setCarregando(false); }
    }, [url]);
    const invalidar = useCallback(() => { ++versao.current; }, []);
    useEffect(() => {
        atualizar();
        const intervalo = setInterval(atualizar, url?.startsWith("/chat/") ? 5000 : url?.startsWith("/noticias") ? 60000 : 30000);
        return () => { invalidar(); clearInterval(intervalo); };
    }, [atualizar, invalidar, url]);
    return { dados, setDados, erro, carregando, atualizar };
}
