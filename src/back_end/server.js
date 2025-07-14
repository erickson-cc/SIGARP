const express = require("express");
const path = require('path');
const { body, validationResult } = require('express-validator');
const pgp = require("pg-promise")({});
const bcrypt = require("bcrypt");

const usuario = "postgres";
const senha = "postgres";
const db = pgp(`postgres://${usuario}:${senha}@localhost:5432/sigarp`);

const app = express();
const session = require('express-session');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;







app.use(
	session({
		secret: "your-secret-key",
		resave: false,
		saveUninitialized: false,
		cookie: { secure: false },// true (cookies)
	}),
);


app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
// busca os arquivos 'estáticos' na pasta 'public': JS e CSS
app.use(express.static(path.join(__dirname, '..', 'front_end')));
passport.use(
	new LocalStrategy(
		{
			usernameField: "email",
			passwordField:	"senha",
		},
		async (email, senha, done) => {
			console.log("--- Tentativa de Login ---");
			console.log("Email recebido:", email);
			console.log("Senha recebida (plain text):", senha);

			try {
				const user = await db.oneOrNone(
					"SELECT * FROM usuario WHERE email = $1;",
					[email],
				);
				if(!user) {
					console.log("Usuário não encontrado para o email:", email);
					return done(null, false, { message : "Email ou senha incorretos" });
				}
				console.log("Usuário encontrado (do banco de dados):", user.email);
				console.log("Senha do banco de dados (hashed):", user.senha); 

					const passwordMatch = await bcrypt.compare(
						senha,
						user.senha,
					);

					if (passwordMatch) {
						console.log("Usuário Autenticado!");
						return done(null, user);
					}
					else {
						console.log("Senha incorreta para o usuário:", email);

						return done(null, false, { message: "Email ou senha incorretos" });
					}
				}
				catch (error) {
					console.error("Erro na autenticação", error);
					return done(error);
				} finally {
					console.log("--- Fim da Tentativa de Login ---");
				}
		},
	),
);
passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: "your-secret-key",
		},
		async (payload, done) => {
			try{
				const usuario = await db.oneOrNone(
					//"SELECT * FROM users WHERE user_id = $1;",
					//[payload.username],// ou usuario
					"SELECT * FROM usuario WHERE id = $1;",
					[payload.id],// ou usuario
				);

				if (usuario) {
					done(null, usuario);
				}
				else{
					done(null, false);
				}
			}catch (error) {
				done(error, false);
			}
		},
	),
);

passport.serializeUser(function (user, cb) {
	process.nextTick(function () {
		return cb(null, {
			user_id: user.id,
			email: user.email,
		});
	});
});
passport.deserializeUser(function (user, cb) {
	process.nextTick(function (){
		return cb(null, user);
	});
});



const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor está rodando na porta ${PORT}.`));

app.get("/login", (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'front_end', 'html', 'login.html'));
});

app.post("/user/login", (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error("Erro de autenticação:", err);
            return res.status(500).json({ status: "Erro interno do servidor." });
        }
        if (!user) {
            // Autenticação falhou
            return res.status(401).json({ status: info.message || "E-mail ou senha incorretos." });
        }
        // Autenticação bem-sucedida, logar o usuário na sessão
        req.logIn(user, (err) => {
            if (err) {
                console.error("Erro ao logar usuário:", err);
                return res.status(500).json({ status: "Erro ao estabelecer sessão." });
            }
            // Redirecionar para a página de cadastro de licitação
            return res.status(200).json({ status: "Login bem-sucedido!", redirectUrl: "/cadastro_licitacao" });// aqui tá o window.location.ref do script_login.js
        });
    })(req, res, next);
});

const requireJWTAuth = passport.authenticate("jwt", {session:false});//descartável
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // Usuário autenticado, continua para a próxima rota
    }
    // Se não estiver autenticado, redireciona para a página de login
    res.redirect('/login');
}
app.get("/cadastro_demanda", isAuthenticated, async (req, res) => {
	try{
		// Comentei pois ficou com 2 res na mesma função
		//const clientes = await db.any("SELECT * FROM CLIENTES;");
		//console.log("Retornando todos os clientes.");
		//res.json(clientes).status(200);
		res.sendFile(path.join(__dirname, '..', 'front_end', 'html', 'cadastro_demanda.html'));
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
});

app.get("/consulta_licitacoes_rota", isAuthenticated, async (req, res) => {
	console.log("/consulta_licita_rota"); // Remover
    try {
        const licitacoes = await db.any("SELECT numerolic, anolic, descrlic FROM licitacao ORDER BY anolic DESC, numerolic DESC;");
	console.log("Licitações buscadas do DB:", licitacoes);// Remover 

        res.status(200).json(licitacoes);
    } catch (error) {
        console.error("Erro ao buscar licitações:", error);
        res.status(500).json({ message: "Erro interno do servidor ao buscar licitações." });
    }
});
app.get("/editar_licitacao", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'front_end', 'html', 'editar_licitacao.html'));
});
app.get("/cadastro_fornecedor", isAuthenticated, async (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'front_end', 'html', 'cadastro_fornecedor.html'));
});

app.get("/cadastro_item", isAuthenticated, async (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'front_end', 'html', 'cadastro_item.html'));
});

app.get("/cadastro_lance",  isAuthenticated, async (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'front_end', 'html', 'cadastro_lance.html'));
});

app.get("/cadastro_licitacao", isAuthenticated, async (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'front_end', 'html', 'cadastro_licitacao.html'));
});

app.get("/cadastro_solicitacao",  isAuthenticated, async (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'front_end', 'html', 'cadastro_solicitacao.html'));
});

app.get("/cadastro_unidade",  isAuthenticated, async (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'front_end', 'html', 'cadastro_unidade.html'));
});

app.get("/cadastro_usuario",  isAuthenticated, async (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'front_end', 'html', 'cadastro_usuario.html'));
});

app.get("/consulta_licitacoes",  isAuthenticated, async (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'front_end', 'html', 'consulta_licitacoes.html'));
});
app.post("/cadastro_fornecedor_rota",
	[
	//body('nomeforn').trim().isLength({ min: 3, max: 35 }).withMessage('Nome do fornecedor deve ter entre 3 e 35 caracteres.'),
        //body('cnpjforn').trim().isLength({ min: 14, max: 18 }).withMessage('CNPJ inválido.').matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/).withMessage('Formato de CNPJ inválido (xx.xxx.xxx/xxxx-xx).'),
        //body('nomerepr').trim().isLength({ min: 3, max: 35 }).withMessage('Nome do representante deve ter entre 3 e 35 caracteres.'),
        //body('cpfrepr').trim().isLength({ min: 11, max: 14 }).withMessage('CPF inválido.').matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/).withMessage('Formato de CPF inválido (xxx.xxx.xxx-xx).'),
        //body('idrepr').trim().notEmpty().withMessage('RG do representante não pode ser vazio.'),
        //body('logradouroforn').trim().isLength({ min: 3, max: 35 }).withMessage('Logradouro deve ter entre 3 e 35 caracteres.'),
        //body('bairroforn').trim().isLength({ min: 3, max: 20 }).withMessage('Bairro deve ter entre 3 e 20 caracteres.'),
        //body('numendrforn').trim().isNumeric().withMessage('Número do endereço deve ser numérico.'),
        //body('cepforn').trim().isLength({ min: 7, max: 9 }).withMessage('CEP inválido.').matches(/^\d{5}-?\d{3}$/).withMessage('Formato de CEP inválido (xxxxx-xxx ou xxxxxxx).'),
        //body('cidadeforn').trim().isLength({ min: 3, max: 20 }).withMessage('Cidade deve ter entre 3 e 20 caracteres.'),
        //body('ufforn').trim().isLength({ min: 2, max: 2 }).withMessage('UF deve ter 2 caracteres.').isAlpha().withMessage('UF deve conter apenas letras.'),
    ],
	async (req,res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
		    return res.status(400).json({ errors: errors.array() });
        }
        try {
            const {
                nomeforn,
                cnpjforn,
                nomerepr,
		cpfrepr,
                idrepr,
                logradouroforn,
                bairroforn,
                numendrforn,
                cepforn,
                cidadeforn,
                ufforn
                //representante_ref
            } = req.body;


            try {
                await db.none(
                    "INSERT INTO representante (cpfrepr, idrepr, nomerepr) VALUES ($1, $2, $3) ON CONFLICT (cpfrepr) DO UPDATE SET nomerepr = EXCLUDED.nomerepr, idrepr = EXCLUDED.idrepr;",
                    [cpfrepr, idrepr, nomerepr]
                    //[cpf_representante_fornecedor, nome_representante_fornecedor, rg_representante_fornecedor]
                );
            } catch (repError) {
                console.error("Erro ao inserir/atualizar representante:", repError);
            }
	const Inserir_no_banco_fornecedor = await db.one(
                "INSERT INTO fornecedor (cnpjforn, nomeforn, ufforn, cepforn, cidadeforn, bairroforn, numendrforn, logradouroforn, representante_ref) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING cnpjforn, nomeforn",
                [
                    cnpjforn,
                    nomeforn,
                    ufforn,
                    cepforn,
                    cidadeforn,
                    bairroforn,
                    numendrforn,
                    logradouroforn,
                    cpfrepr // Referência ao CPF do representante
                ]
            );
	    console.log(`Fornecedor criado: CNPJ ${Inserir_no_banco_fornecedor.cnpjforn}`);
            res.status(201).json(Inserir_no_banco_fornecedor);
        } catch (error) {
            console.log(error);
            if (error.code === '23505') { // unique_violation
                return res.status(409).json({ error: 'Já existe um fornecedor com este CNPJ.' });
            }
            res.status(400).json({ error: error.message });
        }
    }
);






app.post("/cadastro_item_rota", 
	[
		body('nuc')
			.trim()
			.isNumeric()
			.isInt({ gt: 0}),
		body('nomeitem')
			.trim()
			.not().isNumeric().withMessage("O nome não pode ser um número."),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// Se houver erros, retorna o status 400 com a lista de erros.
			return res.status(400).json({ errors: errors.array() });
}
  try {
		const nuc = req.body.nuc;
		const nomeitem = req.body.nomeitem;

    const Inserir_no_banco_item = await db.one(
      "INSERT INTO item (nuc, nomeitem) VALUES ($1, $2) RETURNING nuc, nomeitem",
      [nuc, nomeitem]
    );

    console.log(`Item criado: NUC ${Inserir_no_banco_item.nuc}`);
    res.status(201).json(Inserir_no_banco_item);
  } catch (error) {
    console.log(error);
            if (error.code === '23505') { // Código padrão do PostgreSQL para 'unique_violation'
                return res.status(409).json({ error: 'Já existe um item com este NUC.' });
            }

    res.status(400).json({ error: error.message });
  }	
}
);
app.post("/cadastro_licitacao_rota", 
	[
	//  O campo 'ano_licitacao' que vem no corpo da requisição.
        body('ano_licitacao')
            .trim() // Remove espaços em branco do início e do fim.
            .isLength({ min: 4, max: 4 }) // Garante que o comprimento seja exatamente 4.
            .withMessage('O ano da licitação deve ter exatamente 4 caracteres.') // Mensagem de erro se a validação falhar.
            .isNumeric() // Garante que o valor contém apenas números.
            .withMessage('O ano deve ser um valor numérico.'),

        //  O campo 'num_licitacao'.
        body('num_licitacao')
            .isInt({ lt: 1000 }) // Verifica se é um número inteiro e se é 'less than' (menor que) 1000.
            .withMessage('O número da licitação deve ser um número inteiro menor que 1000.'),

    ]
	, async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// Se houver erros, retorna o status 400 com a lista de erros.
			return res.status(400).json({ errors: errors.array() });
}
  try {
		const ano_licitacao = req.body.ano_licitacao;
		const num_licitacao = req.body.num_licitacao;
		const descricao_licitacao = req.body.descricao_licitacao;

    const Inserir_no_banco = await db.one(
      "INSERT INTO licitacao (numerolic, anolic, descrlic) VALUES ($1, $2, $3) RETURNING anolic, numerolic, descrlic",
      [num_licitacao, ano_licitacao, descricao_licitacao]
    );

    console.log(`Licitacão criado: ID ${Inserir_no_banco.numerolic}`);
    res.status(201).json(Inserir_no_banco);
  } catch (error) {
    console.log(error);
            if (error.code === '23505') { // Código padrão do PostgreSQL para 'unique_violation'
                return res.status(409).json({ error: 'Já existe uma licitação com este número e ano.' });
            }

    res.status(400).json({ error: error.message });
  }	
}
);

app.post("/login", function (req, res) {
  const nome = req.body.nome;
  res.send(`Hello, ${nome}!`);
});

app.get("/", (req, res) => {
	// Redireciona para login
	// Implementar algo para reconhecer se o usuário está autenticado
	res.redirect("/login");
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
app.delete("/crud/licitacoes/:numerolic/:anolic", isAuthenticated, async (req, res) => {
    try {
        const numerolic = parseInt(req.params.numerolic);
        const anolic = parseInt(req.params.anolic);

	    // Validação para consultra usando ano e numero
        if (isNaN(numerolic) || isNaN(anolic)) {
            return res.status(400).json({ message: "Número ou ano da licitação inválidos para exclusão." });
        }

        // Executa a exclusão no banco de dados usando a ano e numero
        const result = await db.result("DELETE FROM licitacao WHERE numerolic = $1 AND anolic = $2;", [numerolic, anolic]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Licitação não encontrada." });
        }

        console.log(`Licitação Número: ${numerolic}, Ano: ${anolic} removida com sucesso.`);
        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar licitação:", error);
        res.status(500).json({ message: "Erro interno do servidor ao deletar licitação." });
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
