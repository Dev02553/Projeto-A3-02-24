const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 8080;

// Middleware para corrigir Content-Type para arquivos .js
app.use((req, res, next) => {
    if (req.url.endsWith(".js")) {
        const filePath = path.join(__dirname, "public", req.url);
        if (fs.existsSync(filePath)) {
            res.setHeader("Content-Type", "application/javascript");
        } else {
            return res.status(404).send("Arquivo JavaScript não encontrado.");
        }
    }
    next();
});

// Middleware padrão
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// Conexão com o banco de dados
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin",
    database: "restaurante",
});

db.connect((err) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err);
        return;
    }
    console.log("Conectado ao banco de dados.");
});

// Rotas para Produtos
app.get("/api/produtos", (req, res) => {
    db.query("SELECT * FROM produtos", (err, results) => {
        if (err) {
            console.error("Erro ao carregar produtos:", err);
            res.status(500).json({ error: "Erro ao carregar produtos." });
        } else {
            const produtos = results.map((produto) => ({
                ...produto,
                preco: parseFloat(produto.preco),
            }));
            res.status(200).json(produtos);
        }
    });
});

app.post("/api/produtos", (req, res) => {
    const { nome, descricao, preco, categoria, quantidade } = req.body;
    if (!nome || !descricao || preco === undefined || !categoria || quantidade === undefined) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }
    const query = "INSERT INTO produtos (nome, descricao, preco, categoria, quantidade) VALUES (?, ?, ?, ?, ?)";
    db.query(query, [nome, descricao, preco, categoria, quantidade], (err, result) => {
        if (err) {
            console.error("Erro ao salvar produto:", err);
            res.status(500).json({ error: "Erro ao salvar produto." });
        } else {
            res.status(201).json({ id: result.insertId, nome, descricao, preco, categoria, quantidade });
        }
    });
});

app.delete("/api/produtos/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM produtos WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error("Erro ao excluir produto:", err);
            res.status(500).json({ error: "Erro ao excluir produto." });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: "Produto não encontrado." });
        } else {
            res.status(200).json({ message: "Produto excluído com sucesso." });
        }
    });
});

// Rotas para Pedidos
app.get("/api/pedidos", (req, res) => {
    const query = `
        SELECT pedidos.id, pedidos.status, pedidos.data_pedido, produtos.nome AS produto_nome
        FROM pedidos
        LEFT JOIN produtos ON pedidos.produto_id = produtos.id;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error("Erro ao carregar pedidos:", err);
            res.status(500).json({ error: "Erro ao carregar pedidos." });
        } else {
            res.status(200).json(results);
        }
    });
});

app.post("/api/pedidos", (req, res) => {
    const { produto_id, status, data_pedido } = req.body;
    if (!produto_id || !status || !data_pedido) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }
    const query = "INSERT INTO pedidos (produto_id, status, data_pedido) VALUES (?, ?, ?)";
    db.query(query, [produto_id, status, data_pedido], (err, result) => {
        if (err) {
            console.error("Erro ao salvar pedido:", err);
            res.status(500).json({ error: "Erro ao salvar pedido." });
        } else {
            const getPedidoQuery = `
                SELECT pedidos.id, pedidos.status, pedidos.data_pedido, produtos.nome AS produto_nome
                FROM pedidos
                LEFT JOIN produtos ON pedidos.produto_id = produtos.id
                WHERE pedidos.id = ?;
            `;
            db.query(getPedidoQuery, [result.insertId], (err, pedidoResult) => {
                if (err) {
                    console.error("Erro ao carregar pedido salvo:", err);
                    res.status(500).json({ error: "Pedido salvo, mas erro ao buscar detalhes." });
                } else {
                    res.status(201).json(pedidoResult[0]);
                }
            });
        }
    });
});

app.delete("/api/pedidos/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM pedidos WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error("Erro ao excluir pedido:", err);
            res.status(500).json({ error: "Erro ao excluir pedido." });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: "Pedido não encontrado." });
        } else {
            res.status(200).json({ message: "Pedido excluído com sucesso." });
        }
    });
});

// Rotas para Reservas
app.get("/api/reservas", (req, res) => {
    const query = `
        SELECT reservas.id, reservas.telefone_cliente, reservas.mesa_id, reservas.data_reserva, 
               pedidos.id AS pedido_id, produtos.nome AS produto_nome
        FROM reservas
        LEFT JOIN pedidos ON reservas.pedido_id = pedidos.id
        LEFT JOIN produtos ON pedidos.produto_id = produtos.id;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error("Erro ao carregar reservas:", err);
            res.status(500).json({ error: "Erro ao carregar reservas." });
        } else {
            res.status(200).json(results);
        }
    });
});

app.post("/api/reservas", (req, res) => {
    const { pedido_id, telefone_cliente, mesa_id, data_reserva } = req.body;
    if (!pedido_id || !telefone_cliente || !mesa_id || !data_reserva) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }
    const query = "INSERT INTO reservas (pedido_id, telefone_cliente, mesa_id, data_reserva) VALUES (?, ?, ?, ?)";
    db.query(query, [pedido_id, telefone_cliente, mesa_id, data_reserva], (err, result) => {
        if (err) {
            console.error("Erro ao salvar reserva:", err);
            res.status(500).json({ error: "Erro ao salvar reserva." });
        } else {
            res.status(201).json({ id: result.insertId, pedido_id, telefone_cliente, mesa_id, data_reserva });
        }
    });
});

app.delete("/api/reservas/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM reservas WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error("Erro ao excluir reserva:", err);
            res.status(500).json({ error: "Erro ao excluir reserva." });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: "Reserva não encontrada." });
        } else {
            res.status(200).json({ message: "Reserva excluída com sucesso." });
        }
    });
});

// Servir o arquivo index.html na rota raiz
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/HTMLs/index.html"));
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
