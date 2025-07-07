const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
    const { token } = req.cookies;
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) {
            return res.status(401).json({ status: "Token invalido" });
        }

        req.user = {
            id: decoded.id,
            nomeCompleto: decoded.nomeCompleto
        }

        next();
        
    } catch (error) {
        //console.log(error);
        return res.status(400).json(error);
    }
}

module.exports = {
    verificarToken
};

