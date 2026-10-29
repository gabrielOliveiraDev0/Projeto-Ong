import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Autenticacao } from "./servicos/Autenticacao";
import App from './App.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Autenticacao><App /></Autenticacao>
  </StrictMode>,
)
