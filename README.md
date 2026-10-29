# Projeto ONG

Sistema acadêmico para gestão de animais, adoções, estoque e alimentação, notícias, chat e relatórios administrativos. Mantém os perfis USUARIO, VETERINARIO e ADMINISTRADOR.

## Tecnologias e arquitetura

React 19, Vite, React Router, Java 21, Spring Boot, JPA/Hibernate, PostgreSQL, BCrypt e JWT.

`Usuários → React (Render Static Site) → Spring Boot (Render Web Service) → PostgreSQL compartilhado`

A configuração prevê uma instância do backend e vários usuários simultâneos. Os arquivos ficam em disco persistente separado do banco.

## Execução local

Requisitos: Java 21, Node compatível com Vite 8 (22.12+), npm e PostgreSQL. Crie o banco `projeto_ong`.

Backend:

```bash
cd backend
cp .env.example .env
```

Preencha a senha do seu PostgreSQL e uma `JWT_SECRET` aleatória de pelo menos 32 bytes. Pode gerar a chave com `openssl rand -hex 32`. Mantenha-a entre reinicializações. Não compartilhe nem versione o `.env`. O backend lê esse arquivo automaticamente quando iniciado na pasta `backend`.

```bash
./mvnw spring-boot:run
```

Frontend, em outro terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Variáveis de ambiente

| Backend | Valor/uso |
| --- | --- |
| DATABASE_URL | URL JDBC: `jdbc:postgresql://localhost:5432/projeto_ong` |
| DATABASE_USER | Usuário do PostgreSQL |
| DATABASE_PASSWORD | Senha do PostgreSQL |
| JWT_SECRET | Segredo estável, aleatório, mínimo de 32 bytes; obrigatório inclusive localmente |
| FRONTEND_URL | Origem exata, sem barra final; local `http://localhost:5173` |
| UPLOAD_DIR | Local `./uploads`; produção `/var/data/uploads` |
| SPRING_PROFILES_ACTIVE | `local` ou `prod` |
| DB_POOL_MAX / DB_POOL_MIN | `10` / `2` |
| PORT | Opcional, padrão `8080`; Render fornece automaticamente |

Frontend: `VITE_API_URL=http://localhost:8080` localmente; URL HTTPS do backend em produção. É aplicada no build: alterou a URL, reconstrua o frontend.

## Uploads e dados

`UPLOAD_DIR` contém `animais/`, `noticias/`, `perfis/` e `holerites/`. JPG, PNG e WebP têm limite de 5 MB, validação de extensão, MIME e assinatura do arquivo, além de nomes gerados pelo servidor. Holerites são acessíveis somente pelo endpoint autenticado, ao próprio solicitante ou administrador.

Iniciando em `backend`, `./uploads` corresponde a `backend/uploads`. Os 16 arquivos locais anteriores foram copiados para essa pasta, sem remover os originais de `uploads/`. Em outro checkout, copie seus arquivos antigos para o diretório configurado mantendo nomes e subpastas. O banco guarda os nomes, não o conteúdo dos arquivos.

O esquema usa `ddl-auto=update`; não apaga o banco ao iniciar. Banco e arquivos precisam de backup. Os testes abaixo utilizam um PostgreSQL temporário separado.

## Build e testes

Frontend:

```bash
cd frontend
npm run build
npm run lint
```

Backend, com ambiente e banco configurados:

```bash
cd backend
./mvnw clean test
./mvnw clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

Para executar as verificações em banco temporário, a partir da raiz, sem usar o banco da aplicação:

```bash
python3 scripts/validar_producao.py
```

Requer Python 3, `psql`, `pg_isready` e binários PostgreSQL 18. Defina `PG_BIN` se estiverem em outra pasta. Utiliza as portas locais 15439 e 18089, que devem estar livres. `MAVEN_TEST_CACHE` permite indicar outro cache Maven. O script executa `clean test`, `clean package`, testes HTTP concorrentes, uploads, CORS, reinicialização e encerra seus processos ao terminar. Não é um teste de carga.

## Concorrência

O estoque mantém bloqueios pessimistas em ordem de ID antes do processamento e das alterações. Adoções bloqueiam e recarregam o animal antes de decidir, inclusive quando o estoque está vazio. Aprovação, recusa das concorrentes e encerramento da alimentação pertencem à mesma transação. Atualizações clínicas e administrativas seguem a ordem estoque → animal.

O scheduler permanece a cada 60 segundos; usa o mesmo processamento transacional validado em paralelo com movimentação e atualização veterinária. `processadoAte` é atualizado junto com a baixa. Chat mantém autorização por participante e bloqueio para criação de conversa. Polling: chat 5 s, demais consultas 30 s, notícias 60 s.

Mais de uma instância exigirá revisão do scheduler e coordenação adicional; não habilite escalabilidade horizontal nesta configuração.

## Deploy

Veja [DEPLOY.md](DEPLOY.md). `render.yaml` prepara banco, backend Docker, disco e frontend com rewrite SPA. O endpoint público `GET /health` retorna apenas `{"status":"UP"}`; não é um diagnóstico do banco.
