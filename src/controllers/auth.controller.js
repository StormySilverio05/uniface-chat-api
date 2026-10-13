import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {prisma} from '../db.js'

export const signUp = async(req, res)=>{
    try {
        const {userName, email, password} = req.body;

        const existUser = await prisma.user.findUnique({where: {email}});
        if(existUser)
            return res.status(400).json({error: "Usuario ya existe"});
        const encryptedPass = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({data: {userName, email, password: encryptedPass}});
        const token = jwt.sign(
            {id: user.id, email: user.email, role: user.role},
            process.env.SECRET_KEY,
            {expiresIn: "24h"}
        )
        return res.status(201).json({token, user});
    } catch (error) {
        return res.status(500).json({error: "Error en el servidor al registrar usuario"});
    }
}

export const signIn = async(req, res)=>{
    try {
        const {email, password} = req.body;
        const existUser = await prisma.user.findUnique({where: {email}});
        if(!existUser)
            return res.status(401).json({error: "Crendenciales Incorrectas"});
        const verify = await bcrypt.compare(password, existUser.password);
        if(!verify)
            return res.status(401).json({error: "Crendenciales Incorrectas"});
        const token = jwt.sign(
            {id: existUser.id, email: existUser.email, role: existUser.role},
            process.env.SECRET_KEY,
            {expiresIn: "24h"}
        )
        return res.status(201).json({token, existUser});
    } catch (error) {
        return res.status(500).json({error: "Error en el servidor al logear usuario"});
    }
}