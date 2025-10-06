import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

import ProductManager from "./src/ProductManager.js";
import viewsRouter from "./src/routes/views.router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const productManager = new ProductManager("./products.json");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Handlebars 
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/", viewsRouter);

// WebSockets
io.on("connection", async (socket) => {
  console.log("Cliente conectado", socket.id);

  // Enviar lista inicial
  socket.emit("updateProducts", await productManager.getProducts());

  // Escuchar nuevo producto
  socket.on("newProduct", async (data) => {
    console.log("newProduct recibido en servidor:", data)
    await productManager.addProduct(data);
    io.emit("updateProducts", await productManager.getProducts());
  });

  // Escuchar eliminación
  socket.on("deleteProduct", async (id) => {
    console.log("deleteProduct recibido en servidor", id)
    await productManager.deleteProduct(id);
    io.emit("updateProducts", await productManager.getProducts());
  });
});

// Server
const PORT = 8080;
server.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));