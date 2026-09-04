import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import CadastrarAnimais from "../Paginas/PaginaCadastrarAnimais";
import CadastrarUsuarios from "../Paginas/PaginaCadastrarUsuarios";
import PaginaInicial from "../Paginas/PaginaInicial";
import Login from "../Paginas/PaginaLogin";
import PaginaNoticias from "../Paginas/PaginaNoticias";
import DetalhesAnimais from "../Paginas/DetalhesAnimais";


import PaginaSobreNos from "../Paginas/PaginaSobreNos";
import PaginaVerAnimais from "../Paginas/PaginaVerAnimais";
 
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
                    path="/DetalhesAnimais"
                    element={<DetalhesAnimais />}
                />

                
            </Routes>

        </BrowserRouter>
    );
}

export default Rota;