const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("./database");

const { verificarToken } = require("./middleware");
const path = require('path');


const router = Router();
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'front_end', 'html', 'login.html'));
});
router.get('/cadastro_usuario', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'front_end', 'html', 'cadastro_usuario.html'));
});
router.get('/cadastro_unidade', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'front_end', 'html', 'cadastro_unidade.html'));
});
router.get('/cadastro_item', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'front_end', 'html', 'cadastro_item.html'));
});
router.get('/cadastro_fornecedor', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'front_end', 'html', 'cadastro_fornecedor.html'));
});
router.get('/cadastro_licitacao', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'front_end', 'html', 'cadastro_licitacao.html'));
});
router.get('/cadastro_lance', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'front_end', 'html', 'cadastro_lance.html'));
});


router.post("/user/cadastro_usuario", /*verificarToken,*/ async (req, res) => {
    const { nomeCompleto, funcao, unidade, email, senha } = req.body;

    try {
        // Cria o id único
        let id = 0;
        let idJaExistente = true;
        while(idJaExistente)
        {
            id = Math.floor(Math.random() * 1000000);
            const query = await db.query("SELECT id FROM usuario WHERE id=$1", [id]);
            if(query.rowCount == 0)
                idJaExistente = false;
        }

        // Hashear senha
        const senhaHasheada = await bcrypt.hash(senha, parseInt(process.env.PASSWORD_SALT));
     
        // Cria o usuário
        await db.query("INSERT INTO usuario (id, nome_completo, funcao, nomeunid_u, email, senha) VALUES ($1, $2, $3, $4, $5, $6)", 
            [id, nomeCompleto, funcao, unidade, email, senhaHasheada]
        );

        return res.status(201).json({
            status: "Usuario criado",
            user: {
                id,
                nomeCompleto,
                funcao,
                unidade,
                email
            }
        });
    } catch (error) {
            console.error(error); // Isso vai mostrar o erro no console

        return res.status(500).json(error);   
    }
});

router.post("/user/cadastro_item", /*verificarToken,*/ async (req, res) => {
    const { nuc_item, nome_item } = req.body;

    try {

        // Verificar se o email existe e obter senha
        const query = await db.query("SELECT nuc FROM item WHERE nuc=$1", [nuc_item]);

        if(query.rowCount > 0)
            return res.status(404).json({ status: " Já existe um item com esse codigo" });

        // Cria o item
        await db.query("INSERT INTO item (nuc, nomeitem) VALUES ($1, $2)", 
            [nuc_item, nome_item]
        );

        return res.status(201).json({
            status: "Item criado",
            user: {
                nuc_item,
                nome_item
            }
        });
    } catch (error) {
            console.error(error); // Isso vai mostrar o erro no console

        return res.status(500).json(error);   
    }
});
router.post("/user/cadastro_fornecedor", /*verificarToken,*/ async (req, res) => {
    const { nome_unidade,cod_unidade, nome_diretor_unidade, telefone_unidade, tipo_unidade, logadouro_unidade, bairro_unidade,
        numero_end_unidade, cidade_unidade, cep_unidade } = req.body;

    try {

        // Verificar se o email existe e obter senha
        const query = await db.query("SELECT codunid FROM item WHERE nucodunidc=$1", [cod_unidade]);

        if(query.rowCount > 0)
            return res.status(404).json({ status: " Já existe uma unidade com esse codigo" });

        // Cria o item
        await db.query("INSERT INTO unidade (codunid, nomeunid, cepunid, cidadeunid, bairrounid, numendrunid, logradourounid, telefoneuid, tipounid, nomediretunid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", 
            [ cod_unidade, nome_unidade,  cep_unidade, cidade_unidade, bairro_unidade, numero_end_unidade,logadouro_unidade, telefone_unidade, tipo_unidade, nome_diretor_unidade]
        );

        return res.status(201).json({
            status: "Unidade criada",
            user: {
                nome_unidade,
                cod_unidade, 
                nome_diretor_unidade,
                telefone_unidade,
                tipo_unidade,
                logadouro_unidade,
                bairro_unidade,
                numero_end_unidade,
                cidade_unidade,
                cep_unidade
            }
        });
    } catch (error) {
            console.error(error); // Isso vai mostrar o erro no console

        return res.status(500).json(error);   
    }
});

router.post("/user/login", async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Verificar se o email existe e obter senha
        const query = await db.query("SELECT id, nome_completo, senha FROM usuario WHERE email=$1", [email]);

        if(query.rowCount === 0)
            return res.status(404).json({ status: "Email não encontrado" });

        const result = await bcrypt.compare(senha, query.rows[0].senha);

        if(!result)
            return res.status(401).json({ status: "Senha incorreta" });

        
        // Gerar o token JWT
        const token = jwt.sign({ id: query.rows[0].id, nomeCompleto: query.rows[0].nome_completo }, process.env.JWT_SECRET, {
            expiresIn: process.env.TOKEN_TIME
        });
        
        res.cookie("token", token, { maxAge: parseInt(process.env.COOKIE_TIME), secure: true, httpOnly: true });

        return res.status(200).json({
            status: "Logado"
        });
        
    } catch (error) {
        return res.status(500).json(error);
    }
    
});

module.exports = router;