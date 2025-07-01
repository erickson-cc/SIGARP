const express = require("express");
const path = require('path');
const { body, validationResult } = require('express-validator');
const pgp = require("pg-promise")({});

const usuario = "postgres";
const senha = "postgres";
const db = pgp(`postgres://${usuario}:${senha}@localhost:5432/sigarp`);

const app = express();
app.use(express.json());

// busca os arquivos 'estáticos' na pasta 'public': JS e CSS
//app.use(express.static(__dirname + "/public"));
app.use(express.static(path.join(__dirname, '..', 'front_end')));

const PORT = 3002;
app.listen(PORT, () => console.log(`Servidor está rodando na porta ${PORT}.`));

app.get("/login", (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'front_end', 'html', 'login.html'));
});

app.get("/cadastro_demanda", (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'front_end', 'html', 'cadastro_demanda.html'));
});

app.get("/cadastro_fornecedor", (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'front_end', 'html', 'cadastro_fornecedor.html'));
});

app.get("/cadastro_item", (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'front_end', 'html', 'cadastro_item.html'));
});

app.get("/cadastro_lance", (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'front_end', 'html', 'cadastro_lance.html'));
});

app.get("/cadastro_licitacao", (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'front_end', 'html', 'cadastro_licitacao.html'));
});

app.get("/cadastro_solicitacao", (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'front_end', 'html', 'cadastro_solicitacao.html'));
});

app.get("/cadastro_unidade", (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'front_end', 'html', 'cadastro_unidade.html'));
});

app.get("/cadastro_usuario", (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'front_end', 'html', 'cadastro_usuario.html'));
});

app.get("/consulta_licitacoes", (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'front_end', 'html', 'consulta_licitacoes.html'));
});

app.post("/login", function (req, res) {
  const nome = req.body.nome;
  res.send(`Hello, ${nome}!`);
});

// A partir daqui é o template
app.get("/clientes", async (req, res) => {
  try {
    const clientes = await db.any("SELECT * FROM clientes;");
    console.log("Retornando todos clientes.");
    res.json(clientes).status(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

app.get("/cliente", async (req, res) => {
  try {
    const clienteId = parseInt(req.query.id);
    console.log(`Retornando ID: ${clienteId}.`);
    const clientes = await db.one(
      "SELECT id, nome, email FROM clientes WHERE id = $1;",
      clienteId
    );
    res.json(clientes).status(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

app.post("/cliente", [
        body('nome').isLength({ min: 3, max: 50 }),
        body('email').isLength({ min: 3, max: 50 }).isEmail()
    ], async (req, res) => {
  try {
    const nome = req.body.nome;
    const email = req.body.email;

    const novoCliente = await db.one(
      "INSERT INTO clientes (nome, email) VALUES ($1, $2) RETURNING id, nome, email",
      [nome, email]
    );

    console.log(`Cliente criado: ID ${novoCliente.id}`);
    res.status(201).json(novoCliente);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

app.put("/cliente", async (req, res) => {
  try {
    const id = req.body.id;
    const nome = req.body.nome;
    const email = req.body.email;

    await db.none("UPDATE clientes SET nome=$1, email=$2 WHERE id=$3;", [
      nome,
      email,
      id,
    ]);

    console.log(`Cliente alterado: ID ${id}`);
    res.sendStatus(202);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

app.delete("/cliente", async (req, res) => {
  try {
    const id = req.body.id;

    await db.none("DELETE FROM clientes WHERE id=$1;", [id]);

    console.log(`Cliente removido: ID ${id}`);
    res.sendStatus(202);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});
