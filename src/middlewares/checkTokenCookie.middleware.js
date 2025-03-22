import { userDao } from "../persistence/mongo/dao/user.dao.js";
import { verifyToken } from "../utils/jsonWebtoken.js";

export const checkTokenCookie = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) res.status(401).json({ msg: "No se provee un token" });

        const decoded = verifyToken(token);
        const user = await userDao.getOne({ _id: decoded._id });
        if (!user) return res.status(401).json({ msg: "Usuario no encontrado" });

        req.user = user;

        next();
    } catch (error) {
        res.status(401).json({ msg: error.message });
    }
}