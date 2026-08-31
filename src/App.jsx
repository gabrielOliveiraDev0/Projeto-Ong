import {
    BrowserRouter,
    Routes,
    Route,
    useNavigate
} from "react-router-dom";

import CadastrarAnimais from "./Paginas/CadastrarAnimais";
import CadastrarUsuarios from "./Paginas/CadastrarUsuarios";
import PaginaInicial from "./Paginas/PaginaInicial";

import "./App.css";

function Home() {
    const navigate = useNavigate();

    return (
        <>
            <PaginaInicial />

            <button
                className="botao-cadastro-animal"
                onClick={() => navigate("/cadastrarAnimais")}
            >
                Cadastrar Animal
            </button>

            <button
                className="botao-cadastro-usuario"
                onClick={() => navigate("/cadastrarUsuarios")}
            >
                Cadastrar Usuario
            </button>
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />

                <Route
                    path="/cadastrarAnimais"
                    element={<CadastrarAnimais />}
                />

                <Route
                    path="/cadastrarUsuarios"
                    element={<CadastrarUsuarios />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;