import "dotenv/config"
import jwt from 'jsonwebtoken'

export const verifyToken=(req, res, next)=>{
    const header = req.headers["authorization"];
    if(!header)
        return res.satus(401).json({error: "Token Requerido"});
    const token = header.split(" ")[1];
    if(!token)
        return res.satus(401).json({error: "Token Requerido"});

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
    } catch (error) {
        return res.satus(401).json({error: "Token Inválido"});
    }
}