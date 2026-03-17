TRAMA - Cadernos Digitais

Trama é uma aplicação web full stack para organização de anotações pessoais, acadêmicas e profissionais. O projeto simula a experiência de cadernos físicos no ambiente digital, permitindo criar, personalizar e organizar anotações de forma intuitiva e visualmente agradável.

Tecnologias Utilizadas

Backend:
Node.js - Ambiente de execução JavaScript
Express - Framework web
Nodemon - Ferramenta que reinicia o server automaticamente
MongoDB Atlas - Banco de dados NoSQL na nuvem
Mongoose - ODM para modelagem de dados
bcryptjs - Criptografia de senhas
CORS - Middleware de segurança

Frontend:
HTML5 - Estrutura das páginas
CSS3 - Estilização responsiva
JavaScript Vanilla - Lógica e interatividade
Fetch API - Comunicação com backend

Funcionalidades

Sistema de autenticação (registro/login)
Criptografia de senhas com bcrypt
CRUD completo de cadernos
CRUD completo de notas
Personalização de cores dos cadernos
Editor de texto para notas
Sistema de tags para organização
Busca textual em notas
Marcar notas como favoritas
Interface responsiva
Design com paleta de cores

Instalação e Configuração

Pré-requisitos:
Node.js (v14 ou superior)
MongoDB Atlas
NPM

Passo a passo:
1. Clone o repositório
git clone https://github.com/seu-usuario/trama-app.git
cd trama-app

2. Instale as dependências
npm install

3. Inicie o servidor
nodemon server.js

4. Acesse a aplicação
http://localhost:3001
