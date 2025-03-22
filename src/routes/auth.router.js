import { Router } from "express";
import { userDao } from "../persistence/mongo/dao/user.dao.js";
import { comparePassword, hashPassword } from "../utils/hasPassword.js";
import { authRole } from "../middlewares/authRole.middleware.js";
import { createToken } from "../utils/jsonWebtoken.js";
import { checkTokenHeader } from "../middlewares/checkTokenHeader.middleware.js";

const router = Router();

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userDao.getOne({ email });

        if (!user || !comparePassword(user.password, password))
            return res.status(401).json({ message: "Email o password invalido" });

        // Guardamos la información del usuario en las session
        // lo comento porquer estoy por usar JWT
        // req.session.user = user; 

        const tokenInfo = {
            _id: user._id,
            email: user.email,
            role: user.role
        }

        const token = createToken(tokenInfo);

        res.status(200).json({ user, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
});

router.post("/register", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userDao.getOne({ email });
        if (user) return res.status(400).json({ message: "Ya hay un usuario registrado con ese email" });
        const newUserData = {
            ...req.body,
            password: hashPassword(req.body.password)
        }
        // Crear un nuevo usuario
        const newUser = await userDao.create(newUserData);

        res.status(201).json(newUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
});

router.get("/profile", checkTokenHeader, authRole(["admin", "user"]), async (req, res) => {
    try {
        res.status(200).json({ user: req.user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
});

router.get("/logout", async (req, res) => {
    try {
        req.session.destroy();
        res.status(200).json({ message: "Session cerrada" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
});

export default router;
