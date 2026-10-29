import { createContext, useContext } from "react";
export const Contexto = createContext(null);
export function useAutenticacao() { return useContext(Contexto); }
