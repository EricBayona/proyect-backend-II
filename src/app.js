import express from "express";
import { connectMongoDB } from "./config/mongoDB.config.js";
import routes from "./routes/index.js"
const app = express();

connectMongoDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use("/api", routes);

app.use((req, res) => {
    res.status(404).json({ error: "Recurso no encontrado" });
});


app.listen(5000, () => {
    console.log("Servidor escuchando en el puerto 5000");
});