🍽️ Restaurante – Projeto Final A3

Este repositório contém o projeto final A3 da disciplina de Análise e Desenvolvimento de Sistemas.
O objetivo foi construir um sistema de gestão para restaurante, com funcionalidades de produtos, pedidos e reservas, integrando Node.js, Express e MySQL.

✨ Funcionalidades

Produtos

Listagem de produtos

Cadastro de novos produtos

Exclusão de produtos

Pedidos

Listagem de pedidos (com produtos associados)

Registro de novos pedidos

Exclusão de pedidos

Reservas

Listagem de reservas (associadas a pedidos e produtos)

Registro de novas reservas

Exclusão de reservas

Frontend

Servido a partir da pasta /public

Página inicial: index.html

🛠️ Tecnologias

Node.js + Express – servidor e API REST

MySQL / MySQL2 – banco de dados relacional

CORS – controle de acesso

dotenv – variáveis de ambiente

HTML/CSS/JS – frontend estático em /public

🚀 Como Executar

Clone o repositório:

git clone https://github.com/SEU-USUARIO/Projeto-Final-A3.git
cd Projeto-Final-A3


Instale as dependências:

npm install


Configure o banco de dados:

Crie um banco chamado restaurante

Configure tabelas produtos, pedidos e reservas conforme os relacionamentos

Ajuste as credenciais em .env (já configurado para root/admin)

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=admin
DB_NAME=restaurante


Inicie o servidor:

node server.js


O app rodará em: http://localhost:8080

📖 Extended Description

O projeto foi estruturado para simular um mini sistema de gestão de restaurante, cobrindo os seguintes pontos:

Produtos: CRUD simplificado para o cardápio. Cada produto tem nome, descrição, preço, categoria e quantidade.

Pedidos: Registro de pedidos com associação direta a produtos. Cada pedido contém status e data.

Reservas: Relacionam um cliente (telefone), mesa e pedido, vinculando o fluxo reserva → pedido → produto.

Integração DB: Conexões gerenciadas com mysql2, queries SQL diretas para operações.

Boas práticas:

Middleware para servir corretamente arquivos JS estáticos

Respostas padronizadas em JSON (sucesso/erro)

Uso de variáveis de ambiente com dotenv para maior flexibilidade

Estrutura de rotas organizada por entidade

📂 Estrutura
Projeto-Final-A3/
 ├── public/            # Arquivos estáticos (HTML, CSS, JS)
 │    └── HTMLs/index.html
 ├── server.js          # Servidor principal Express
 ├── package.json       # Dependências e scripts
 ├── .env               # Configurações de banco
 ├── .gitignore         # Ignorar node_modules, logs, etc.

👨‍💻 Autor

Projeto desenvolvido por David Silva Rodrigues

🍽️ Restaurant – Final Project A3 (English)

This repository contains the Final Project A3 for the Systems Analysis & Development course.
The goal was to build a restaurant management system with features for products, orders, and reservations, using Node.js, Express, and MySQL.

Features

Products (list, add, delete)

Orders (list, add, delete, linked to products)

Reservations (list, add, delete, linked to orders/products)

Frontend served from /public

Tech Stack

Node.js + Express

MySQL / MySQL2

CORS, dotenv

HTML/CSS/JS

How to Run
git clone https://github.com/YOUR-USER/Projeto-Final-A3.git
cd Projeto-Final-A3
npm install
node server.js


Server runs at: http://localhost:8080
