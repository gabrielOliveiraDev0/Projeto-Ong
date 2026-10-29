export const categorias = { RACAO: "Ração", MEDICAMENTO: "Medicamento", MATERIAL_VETERINARIO: "Material veterinário", LIMPEZA: "Limpeza", OUTROS: "Outros" };
export const dinheiro = n => Number(n).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const numero = n => Number(n).toLocaleString("pt-BR", { maximumFractionDigits: 3 });
