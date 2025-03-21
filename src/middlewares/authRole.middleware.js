export const authRole = (role) => {
    return (req, res, next) => {
        try {
            if (!req.session.user) return res.status(400).json({ status: "Error", msg: "No autenticado" });
            if (role !== req.session.user.role) return res.status(403).json({ status: "Error", msg: "No tiene permiso" });

            next()
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: "Error", msg: "Error interno en el server" })

        }
    }
}