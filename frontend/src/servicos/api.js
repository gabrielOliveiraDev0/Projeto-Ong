export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/+$/, "");
const mensagens = { 401: "Sessão expirada.", 403: "Você não possui permissão.", 404: "Registro não encontrado.", 409: "O registro foi alterado por outro usuário. Atualize a página e tente novamente.", 500: "Erro interno do servidor." };
export async function requisicao(url, options = {}) {
    const destino = new URL(url, `${API_URL}/`);
    if (destino.origin !== new URL(API_URL).origin) throw new Error("Destino da API inválido.");
    const headers = new Headers(options.headers);
    const token = localStorage.getItem("token");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    const response = await fetch(destino, { ...options, headers });
    if (response.ok) return response;
    const dados = await response.json().catch(() => ({}));
    const message = response.status >= 500 ? mensagens[500] : dados.message || dados.detail || mensagens[response.status] || "Não foi possível concluir a operação.";
    return new Response(JSON.stringify({ message, detail: message }), { status: response.status, headers: { "Content-Type": "application/json" } });
}
export async function api(url, method = "GET", body) {
    const response = await requisicao(url, { method, ...(body === undefined ? {} : { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }) });
    if (!response.ok) throw new Error((await response.json()).message);
    const text = await response.text();
    return text ? JSON.parse(text) : null;
}
