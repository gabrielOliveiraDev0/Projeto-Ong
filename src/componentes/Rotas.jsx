import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import CadastrarAnimais from "../Paginas/CadastrarAnimais";
import CadastrarUsuarios from "../Paginas/CadastrarUsuarios";
import PaginaInicial from "../Paginas/PaginaInicial";

function Rota() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PaginaInicial />} />

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

export default Rota;