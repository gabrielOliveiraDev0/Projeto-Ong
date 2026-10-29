# Publicação no Render

## Preparação

Publique o código no seu repositório, sem `.env`, uploads, `node_modules` ou `target`. O `render.yaml` descreve os recursos; nada foi publicado automaticamente nesta alteração. O backend usa Docker com Java 21, pois Java não é um runtime nativo do Render.

O Blueprint prevê serviço pago com Persistent Disk e PostgreSQL pago. Confira os planos no painel antes de criar os recursos. Referências: [Blueprint](https://render.com/docs/blueprint-spec), [discos persistentes](https://render.com/docs/disks) e [rewrite SPA](https://render.com/docs/redirects-rewrites).

## Passos

1. Crie o PostgreSQL `projeto-ong-db`, na região do backend. Se usar Blueprint, ele será criado com os demais recursos. Para aproveitar um banco já existente, ajuste a referência no YAML antes de aplicar.
2. Configure o Web Service Docker usando `backend/Dockerfile` e contexto `backend`. Mantenha uma instância e health check `/health`. Monte o Persistent Disk em `/var/data`.
3. Preencha as variáveis do backend abaixo. Aguarde `/health` responder 200.
4. Crie o Static Site com build `cd frontend && npm ci && npm run build` e publicação `frontend/dist`. Defina `VITE_API_URL` com a URL HTTPS real do backend.
5. Configure rewrite `/*` → `/index.html` (já declarado no YAML). Atualize `FRONTEND_URL` para a origem HTTPS real do frontend e reinicie o backend. Caso as URLs ainda não existam na criação do Blueprint, preencha com as URLs previstas e corrija após a criação; faça novo build do frontend se necessário.
6. Migre os dados PostgreSQL e copie os arquivos antigos para `/var/data/uploads/`, mantendo as quatro subpastas e os nomes. Faça backup antes de importar; não importe sobre um banco preenchido sem planejar conflitos.
7. Confira login dos três perfis, upload e leitura de imagens, holerite privado, adoção, estoque e atualização direta de `/Login`, `/AmbienteUsuario` e `/PaginaNoticias`.

## Variáveis do backend

```text
DATABASE_URL=jdbc:postgresql://HOST-INTERNO:5432/NOME-DO-BANCO
DATABASE_USER=USUARIO-DO-BANCO
DATABASE_PASSWORD=SENHA-DO-BANCO
JWT_SECRET=SEGREDO-ALEATORIO-ESTAVEL-COM-PELO-MENOS-32-BYTES
FRONTEND_URL=https://URL-REAL-DO-FRONTEND
UPLOAD_DIR=/var/data/uploads
SPRING_PROFILES_ACTIVE=prod
DB_POOL_MAX=10
DB_POOL_MIN=2
```

`DATABASE_URL` deve estar em formato **JDBC**, sem usuário/senha embutidos. Não cole diretamente `postgresql://usuario:senha@host/banco` fornecido pelo Render: use host e banco na URL JDBC e as credenciais nas duas variáveis separadas. No Blueprint, usuário e senha vêm do banco automaticamente; a URL JDBC é preenchida manualmente depois de obter o host interno. O segredo JWT é gerado uma vez pelo Blueprint e preservado; não o gere a cada inicialização.

## Frontend

```text
VITE_API_URL=https://URL-REAL-DO-BACKEND
```

Não coloque segredos em variáveis `VITE_*`, pois entram no JavaScript público. Se escolher `frontend` como Root Directory no painel, use `npm install && npm run build` (ou `npm ci && npm run build`) e Publish Directory `dist`.

## Build do backend

O Dockerfile executa:

```bash
./mvnw clean package -DskipTests
```

E inicia o JAR real:

```bash
java -jar /app/backend-0.0.1-SNAPSHOT.jar
```

Antes do deploy, execute os testes conforme o README. O disco conserva somente arquivos sob `/var/data`; mantenha `UPLOAD_DIR` nesse local. O esquema usa `update`, sem recriar tabelas ou limpar registros.

## Validação realizada

Frontend: build e lint aprovados. Backend: `clean test` e `clean package` aprovados, 7 testes sem falhas, com PostgreSQL isolado. Verificações HTTP adicionais: CORS, autorização, estoque concorrente, adoções concorrentes com estoque vazio, solicitações de usuários distintos, atualização veterinária durante processamento de consumo, chat isolado, upload inválido e válido, preservação do arquivo e token após reinício.

Não foi executado deploy no Render, build da imagem Docker ou teste de carga. A configuração SPA está preparada, mas a atualização de rotas no domínio público depende da publicação. Mantenha uma instância; múltiplas instâncias exigem coordenação adicional do scheduler.

## Arquivos desta preparação para produção

Criados:

- `backend/.env.example`
- `frontend/.env.example`
- `backend/.dockerignore`
- `backend/Dockerfile`
- `backend/src/main/resources/application-prod.properties`
- `backend/src/main/java/com/projetoong/backend/service/UploadService.java`
- `backend/src/main/java/com/projetoong/backend/controller/HealthController.java`
- `backend/src/test/java/com/projetoong/backend/ProducaoTests.java`
- `scripts/validar_producao.py`
- `render.yaml`
- `DEPLOY.md`

Alterados:

- `.gitignore`
- `README.md`
- `backend/src/main/java/com/projetoong/backend/config/AutorizacaoInterceptor.java`
- `backend/src/main/java/com/projetoong/backend/config/WebConfig.java`
- `backend/src/main/java/com/projetoong/backend/controller/AnimalController.java`
- `backend/src/main/java/com/projetoong/backend/controller/ErrosController.java`
- `backend/src/main/java/com/projetoong/backend/controller/FavoritoController.java`
- `backend/src/main/java/com/projetoong/backend/controller/SolicitacaoAdocaoController.java`
- `backend/src/main/java/com/projetoong/backend/controller/UsuarioController.java`
- `backend/src/main/java/com/projetoong/backend/repository/SolicitacaoAdocaoRepository.java`
- `backend/src/main/java/com/projetoong/backend/service/AnimalService.java`
- `backend/src/main/java/com/projetoong/backend/service/JwtService.java`
- `backend/src/main/java/com/projetoong/backend/service/NoticiaService.java`
- `backend/src/main/java/com/projetoong/backend/service/SolicitacaoAdocaoService.java`
- `backend/src/main/java/com/projetoong/backend/service/UsuarioService.java`
- `backend/src/main/resources/application.properties`
- `frontend/src/componentes/CardAnimais.jsx`
- `frontend/src/componentes/FormularioCadastro.jsx`
- `frontend/src/paginas/AmbienteUsuario.jsx`
- `frontend/src/paginas/DetalhesAnimais.jsx`
- `frontend/src/paginas/PaginaCadastrarUsuarios.jsx`
- `frontend/src/paginas/PaginaEditarAnimal.jsx`
- `frontend/src/paginas/PaginaEditarPerfil.jsx`
- `frontend/src/paginas/PaginaInicial.jsx`
- `frontend/src/paginas/PaginaLogin.jsx`
- `frontend/src/paginas/PaginaNoticias.jsx`
- `frontend/src/paginas/PaginaRelatorioAnimais.jsx`
- `frontend/src/paginas/PaginaSolicitarAdocao.jsx`
- `frontend/src/paginas/PaginaVeterinario.jsx`
- `frontend/src/servicos/Autenticacao.jsx`
- `frontend/src/servicos/api.js`
- `frontend/src/servicos/useConsulta.js`

As alterações anteriores de relatórios mensais foram preservadas. Nenhum banco real foi alterado pelos testes; 16 uploads foram copiados localmente para `backend/uploads`, ignorado pelo Git.
