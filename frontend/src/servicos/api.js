export async function requisicao(url, options = {}) {
    const headers = new Headers(options.headers);
    const token = localStorage.getItem("token");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return fetch(url.startsWith("http") ? url : `http://localhost:8080${url}`, { ...options, headers });
}
export async function api(url, method = "GET", body) {
    const response = await requisicao(url, { method, ...(body === undefined ? {} : { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }) });
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || error.message || `Não foi possível concluir (${response.status})`);
    }
    const text = await response.text();
    return text ? JSON.parse(text) : null;
}
