import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import CadastrarAnimais from "../Paginas/PaginaCadastrarAnimais";
import CadastrarUsuarios from "../Paginas/PaginaCadastrarUsuarios";
import PaginaInicial from "../Paginas/PaginaInicial";
import Login from "../Paginas/PaginaLogin";

function Rota() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PaginaInicial />} />
s
                <Route
                    path="/cadastrarAnimais"
                    element={<CadastrarAnimais />}
                />

                <Route
                    path="/cadastrarUsuarios"
                    element={<CadastrarUsuarios />}
                />
                <Route
                    path="/Login"
                    element={<Login />}
                />
            </Routes>
            
        </BrowserRouter>
    );
}

export default Rota;