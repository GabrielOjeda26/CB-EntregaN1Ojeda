import crypto from "crypto";
import fs from "fs/promises";

class CartManager {
  constructor(pathFile) {
    this.pathFile = pathFile;
  }

  generateNewId() {
    return crypto.randomUUID();
  }

  async getCarts() {
    try {
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      return JSON.parse(fileData);
    } catch (error) {
      if (error.code === "ENOENT") return [];
      throw new Error("Error al leer carritos: " + error.message);
    }
  }

  async createCart() {
    const carts = await this.getCarts();
    const newCart = { id: this.generateNewId(), products: [] };
    carts.push(newCart);

    await fs.writeFile(this.pathFile, JSON.stringify(carts, null, 2), "utf-8");
    return newCart;
  }

  async getCartById(cartId) {
    const carts = await this.getCarts();
    return carts.find(c => c.id === cartId);
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.getCarts();
    const indexCart = carts.findIndex(c => c.id === cartId);

    if (indexCart === -1) throw new Error("Carrito no encontrado");

    const cart = carts[indexCart];
    const productIndex = cart.products.findIndex(p => p.product === productId);

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    carts[indexCart] = cart;
    await fs.writeFile(this.pathFile, JSON.stringify(carts, null, 2), "utf-8");
    return cart;
  }
}

export default CartManager;