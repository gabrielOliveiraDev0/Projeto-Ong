import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import CadastrarAnimais from "./Paginas/CadastrarAnimais";


import "./App.css";

function Home() {
    const navigate = useNavigate();

    return (
        <button className="botao-cadastro" onClick={() => navigate("/cadastrar")}>
            Cadastrar Animal
        </button>
        
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cadastrar" element={<CadastrarAnimais />} />
            </Routes>
        </BrowserRouter>
        
    );
}


export default App;