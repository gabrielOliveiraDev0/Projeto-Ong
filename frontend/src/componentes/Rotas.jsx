import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import CadastrarAnimais from "../paginas/PaginaCadastrarAnimais";
import CadastrarUsuarios from "../paginas/PaginaCadastrarUsuarios";
import PaginaInicial from "../paginas/PaginaInicial";
import Login from "../paginas/PaginaLogin";
import PaginaNoticias from "../paginas/PaginaNoticias";
import DetalhesAnimais from "../paginas/DetalhesAnimais";


import PaginaSobreNos from "../paginas/PaginaSobreNos";
import PaginaVerAnimais from "../paginas/PaginaVerAnimais";

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
                    path="/CadastrarUsuarios"
                    element={<CadastrarUsuarios />}
                />
                <Route
                    path="/Login"
                    element={<Login />}
                />
                <Route path="/PaginaInicial"
                    element={<PaginaInicial />} />

                <Route
                    path="/PaginaNoticias"
                    element={<PaginaNoticias />}
                />
                <Route
                    path="/PaginaSobreNos"
                    element={<PaginaSobreNos />}
                />
                <Route
                    path="/PaginaVerAnimais"
                    element={<PaginaVerAnimais />}
                />
                <Route
                    path="/DetalhesAnimais/:id"
                    element={<DetalhesAnimais />}
                />


            </Routes>

        </BrowserRouter>
    );
}

export default Rota;