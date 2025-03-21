import { Router } from "express";
import { cartDao } from "../persistence/mongo/dao/cart.dao.js";
import { cartModel } from "../persistence/mongo/models/cart.model.js";

const router = Router();

router.post("/", async (req, res) => {
    try {
        const cartData = req.body;
        const cart = await cartDao.create(cartData);

        res.status(200).json({ status: "ok", msg: "Carrito creado", cart });
    } catch (error) {
        console.log(error);
        res.send(500).json({ status: "Error", msg: "Error interno del Servidor" })
    }
})

router.get("/", async (req, res) => {
    try {
        const { limit, page, sort } = req.query;
        const options = {
            limit: limit || 10,
            page: page || 1,
            sort: {
                price: sort == "asc" ? 1 : -1
            },
            learn: true,
        };

        const carts = await cartDao.getAll({}, options);
        res.status(200).json({ status: "ok", carts })

    } catch (error) {
        console.log(error);
        res.send(500).json({ status: "ok", msg: "Error interno del Servidor" });
    };

});

router.get("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartDao.getById(cid);
        res.status(200).json({ status: "ok", cart });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", msg: "Error interno del Servidor" })

    }
})

router.put("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const newData = req.body;
        const cart = await cartModel.findByIdAndUpdate(cid, newData);
        res.status(200).json({ status: "ok", cart })
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", msg: "Error interno del Servidor" })
    }
})

router.put("/:cid/product/:pid/add", async (req, res) => {
    try {
        const { cid } = req.params;
        const { pid } = req.params;

        const cart = await cartDao.addProductToCart(cid, pid);
        res.status(200).json({ status: "ok", cart })


    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", msg: "Error interno del Servidor" })
    }
})

router.put("/:cid/product/:pid", async (req, res) => {
    try {
        const { cid } = req.params;
        const { pid } = req.params;
        const { quantity } = req.query;
        console.log({ quantity: quantity });


        const cart = await cartDao.updateQuantityProductToCar(cid, pid, quantity);
        res.status(200).json({ status: "ok", cart })
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", msg: "Error interno del Servidor" })
    }
})

router.delete("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartDao.deleteOne(cid);
        res.status(200).json({ status: "ok", msg: "Carrito eliminado con exito", cart })
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", msg: "Error interno del Servidor" })
    }
})
router.delete("/:cid/product/:pid", async (req, res) => {
    try {
        const { cid } = req.params;
        const { pid } = req.params;

        const cart = await cartDao.deleteProductToCart(cid, pid);
        res.status(200).json({ status: "ok", cart })

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", msg: "Error interno del Servidor" })
    }
})

router.delete("/:cid/clear", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartDao.clearProductsToCart(cid);
        res.status(200).json({ status: "ok", cart })

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", msg: "Error interno del Servidor" })
    }
})

export default router;

