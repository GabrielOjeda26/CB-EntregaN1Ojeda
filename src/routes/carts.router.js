import { Router } from "express";
import CartManager from "../cartManager.js";
import ProductManager from "../productManager.js";

const router = Router();
const manager = new CartManager("./carts.json");
const productManager = new ProductManager("./products.json");

// POST 
router.post("/", async (req, res) => {
  const cart = await manager.createCart();
  res.status(201).json(cart);
});

// GET /:cid 
router.get("/:cid", async (req, res) => {
  const cart = await manager.getCartById(req.params.cid);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
  res.json(cart.products);
});

// POST /:cid/product/:pid
router.post("/:cid/product/:pid", async (req, res) => {
  const product = await productManager.getProductById(req.params.pid);
  if (!product) return res.status(404).json({ error: "Producto no existe" });

  const cart = await manager.addProductToCart(req.params.cid, req.params.pid);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

  res.json(cart);
});

export default router;