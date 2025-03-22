import { userDao } from "../persistence/mongo/dao/user.dao.js";
import { verifyToken } from "../utils/jsonWebtoken.js";


export const checkTokenHeader = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ msg: "No se provee un token" });

        const token = authHeader.split(" ")[1];

        const decoded = verifyToken(token);
        const user = await userDao.getOne({ _id: decoded._id });
        if (!user) return res.status(401).json({ msg: "Usuario no encontrado" });

        req.user = user;

        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({ status: "error", message: "jwt expired" });

    }
}