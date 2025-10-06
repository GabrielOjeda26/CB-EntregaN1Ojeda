import { Router } from "express";
import ProductManager from "../productManager.js";

const router = Router();
const productManager = new ProductManager("./products.json");

// GET 
router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.status(200).json({ message: "Lista de productos", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /:pid
router.get("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const products = await productManager.getProducts();
    const product = products.find(p => p.id === pid);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST 
router.post("/", async (req, res) => {
  try {
    const newProductData = req.body;
    const created = await productManager.addProduct(newProductData);
    res.status(201).json({ message: "Producto añadido", product: created });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /:pid
router.put("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const updates = req.body;
    const updatedProduct = await productManager.setProductById(pid, updates);
    res.status(200).json({ message: "Producto actualizado", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /:pid
router.delete("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const result = await productManager.deleteProductById(pid);
    res.status(200).json({ message: "Producto eliminado", products: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;