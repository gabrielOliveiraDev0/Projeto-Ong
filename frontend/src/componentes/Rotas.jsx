import PaginaRelatorioAnimais from "../paginas/PaginaRelatorioAnimais";
import PaginaEditarPerfil from "../paginas/PaginaEditarPerfil";
import PaginaConfiguracoes from "../paginas/PaginaConfiguracoes";
import PaginaChat from "../paginas/PaginaChat";
import PaginaRelatorios from "../paginas/PaginaRelatorios";
import PaginaEstoque from "../paginas/PaginaEstoque";
import PaginaVeterinario from "../paginas/PaginaVeterinario";
import PaginaGerenciarUsuarios from "../paginas/PaginaGerenciarUsuarios";
import { useAutenticacao } from "../servicos/contextoAutenticacao";
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
import PaginaEditarAnimal from "../paginas/PaginaEditarAnimal";
import PaginaSolicitarAdocao from "../paginas/PaginaSolicitarAdocao";
import PaginaSobreNos from "../paginas/PaginaSobreNos";
import PaginaVerAnimais from "../paginas/PaginaVerAnimais";
function Protegida({ tipos, children }) {
    const { usuario, carregando } = useAutenticacao();
    if (carregando) return <p>Carregando sessão...</p>;
    if (!usuario) return <Navigate to="/Login" replace />;
    if (tipos && !tipos.includes(usuario.tipoUsuario)) return <Navigate to="/AmbienteUsuario" replace />;
    return children;
}
function Rota() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/EditarPerfil" element={<Protegida><PaginaEditarPerfil /></Protegida>} />
                <Route path="/Configuracoes" element={<Protegida><PaginaConfiguracoes /></Protegida>} />
                <Route path="/Chat" element={<Protegida><PaginaChat /></Protegida>} />
                <Route path="/Relatorios" element={<Protegida tipos={["ADMINISTRADOR"]}><PaginaRelatorios /></Protegida>} />
                <Route path="/RelatorioAnimais" element={<Protegida tipos={["ADMINISTRADOR"]}><PaginaRelatorioAnimais /></Protegida>} />
                <Route path="/Estoque" element={<Protegida tipos={["ADMINISTRADOR"]}><PaginaEstoque /></Protegida>} />
                <Route path="/Veterinario" element={<Protegida tipos={["ADMINISTRADOR", "VETERINARIO"]}><PaginaVeterinario /></Protegida>} />
                <Route path="/GerenciarUsuarios" element={<Protegida tipos={["ADMINISTRADOR"]}><PaginaGerenciarUsuarios /></Protegida>} />
                <Route path="/" element={<PaginaInicial />} />
                <Route
                    path="/CadastrarAnimais"
                    element={<Protegida tipos={["ADMINISTRADOR"]}><CadastrarAnimais /></Protegida>}
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
                    element={<Protegida><AmbienteUsuario /></Protegida>}
                />

                <Route
                    path="/EditarAnimal/:id"
                    element={<Protegida tipos={["ADMINISTRADOR"]}><PaginaEditarAnimal /></Protegida>}
                />
                <Route
                    path="/SolicitarAdocao/:idAnimal"
                    element={<Protegida tipos={["USUARIO"]}><PaginaSolicitarAdocao /></Protegida>}
                />


            </Routes>

        </BrowserRouter>
    );
}

export default Rota;