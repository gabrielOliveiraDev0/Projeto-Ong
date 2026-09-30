import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import CadastrarAnimais from "../paginas/PaginaCadastrarAnimais";
import CadastrarUsuarios from "../paginas/PaginaCadastrarUsuarios";
import PaginaInicial from "../paginas/PaginaInicial";
import Login from "../paginas/PaginaLogin";
import PaginaNoticias from "../paginas/PaginaNoticias";
import DetalhesAnimais from "../paginas/DetalhesAnimais";
import AmbienteUsuario from "../paginas/AmbienteUsuario";


import PaginaSobreNos from "../paginas/PaginaSobreNos";
import PaginaVerAnimais from "../paginas/PaginaVerAnimais";

function Rota() {
    const usuarioLogado = JSON.parse(
        localStorage.getItem("usuarioLogado")
    );

    const ehAdministrador =
        usuarioLogado?.tipoUsuario === "ADMINISTRADOR";
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PaginaInicial />} />
                <Route
                    path="/cadastrarAnimais"
                    element={
                        ehAdministrador
                            ? <CadastrarAnimais />
                            : <Navigate to="/PaginaInicial" replace />
                    }
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

                <Route
                    path="/AmbienteUsuario"
                    element={<AmbienteUsuario />}
                />


            </Routes>

        </BrowserRouter>
    );
}

export default Rota;