
# 🐾 Projeto ONG

Aplicação web desenvolvida para auxiliar uma ONG no gerenciamento de animais e no processo de adoção.

O projeto está sendo desenvolvido como uma aplicação **Full Stack**, utilizando React no frontend, Java com Spring Boot no backend e PostgreSQL para armazenamento dos dados.

> 🚧 Projeto em desenvolvimento.

## 🎯 Objetivo

O objetivo do sistema é facilitar o gerenciamento dos animais da ONG e disponibilizar informações para pessoas interessadas em adoção.

O projeto também está sendo utilizado para colocar em prática conhecimentos de desenvolvimento web, APIs REST, Java, React e banco de dados.

## 🚀 Tecnologias

### Frontend

- React
- JavaScript
- Vite
- React Router
- HTML
- CSS

### Backend

- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- Jakarta Validation
- Maven

### Banco de dados

- PostgreSQL
- pgAdmin

### Ferramentas

- Git
- GitHub
- VS Code

## 🏗️ Arquitetura

A aplicação está dividida em três partes principais:

```text
React
  │
  │ HTTP / JSON
  ▼
Spring Boot
  │
  │ JPA
  ▼
PostgreSQL
```

O **frontend** é responsável pela interface utilizada pelo usuário.

O **backend** disponibiliza uma API REST responsável pelas regras de negócio e comunicação com o banco de dados.

O **PostgreSQL** é utilizado para armazenar os dados da aplicação.

## 📂 Estrutura do projeto

```text
Projeto-Ong/
├── frontend/
├── backend/
├── uploads/
└── README.md
```

No backend, o projeto segue uma separação em camadas:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

### Controller

Responsável por receber as requisições HTTP e retornar as respostas da API.

### Service

Responsável pelas regras de negócio da aplicação.

### Repository

Responsável pela comunicação com o banco de dados através do Spring Data JPA.

### Model

Contém as entidades que representam os dados da aplicação.

## 🐶 Funcionalidades

Algumas funcionalidades planejadas para o sistema:

- Cadastro de animais
- Listagem de animais
- Cadastro de usuários
- Visualização de animais disponíveis
- Gerenciamento das informações dos animais
- Processo de adoção

Novas funcionalidades serão adicionadas durante o desenvolvimento.

## ⚙️ Como executar o projeto

### Pré-requisitos

Para executar o projeto é necessário possuir:

- Node.js
- npm
- Java 21
- Maven
- PostgreSQL

## 💻 Frontend

Na raiz do projeto, instale as dependências:

```bash
npm install
```

Execute o servidor de desenvolvimento:

```bash
npm run dev
```

O Vite mostrará no terminal o endereço em que o frontend está disponível.

## ☕ Backend

Entre na pasta do backend:

```bash
cd backend
```

Execute a aplicação Spring Boot:

```bash
mvn spring-boot:run
```

Também é possível utilizar o Maven Wrapper:

```bash
./mvnw spring-boot:run
```

## 🗄️ Banco de dados

O projeto utiliza PostgreSQL.

O banco utilizado durante o desenvolvimento é:

```text
projeto_ong
```

As configurações de conexão com o banco ficam no arquivo:

```text
backend/src/main/resources/application.properties
```

Por segurança, senhas e outras informações sensíveis não devem ser adicionadas ao repositório público.

## 🔗 API

A API está sendo desenvolvida utilizando Spring Boot.

Os endpoints serão documentados aqui conforme forem implementados.

Exemplo da estrutura planejada:

```text
GET     /animais
POST    /animais
GET     /animais/{id}
PUT     /animais/{id}
DELETE  /animais/{id}
```

## 📌 Status

🚧 **Em desenvolvimento**

O projeto está sendo desenvolvido gradualmente e novas funcionalidades serão adicionadas conforme a evolução do sistema.

## 📚 Aprendizados

Este projeto também tem como objetivo praticar conceitos como:

- Desenvolvimento Full Stack
- React
- Componentização
- Rotas com React Router
- APIs REST
- Java
- Spring Boot
- Arquitetura em camadas
- Spring Data JPA
- PostgreSQL
- Git e GitHub

## 👨‍💻 Autor

Desenvolvido como projeto de estudo e aplicação prática de desenvolvimento Full Stack.


# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
