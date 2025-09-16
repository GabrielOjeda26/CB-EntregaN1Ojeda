import crypto from "crypto";
import fs from "fs/promises";

class ProductManager {
  constructor(pathFile) {
    this.pathFile = pathFile;
  }

  generateNewId() {
    return crypto.randomUUID();
  }

  async getProductById(productId) {
    try {
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      const products = JSON.parse(fileData);
      return products.find(p => p.id === productId) || null;
    } catch (error) {
      throw new Error("Error al buscar producto: " + error.message);
    }
  }

  async addProduct(newProduct) {
    try {
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      const products = JSON.parse(fileData);

      const newId = this.generateNewId();
      const product = { id: newId, ...newProduct };
      products.push(product);

      await fs.writeFile(this.pathFile, JSON.stringify(products, null, 2), "utf-8");
      return product;
    } catch (error) {
      throw new Error("Error al añadir el nuevo producto: " + error.message);
    }
  }

  async getProducts() {
    try {
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      return JSON.parse(fileData);
    } catch (error) {
      throw new Error("Error al leer productos: " + error.message);
    }
  }

  async updateProduct(productId, updates) {
    try {
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      const products = JSON.parse(fileData);

      const indexProduct = products.findIndex(p => p.id === productId);
      if (indexProduct === -1) return null;

      const updated = { ...products[indexProduct], ...updates, id: products[indexProduct].id };
      products[indexProduct] = updated;

      await fs.writeFile(this.pathFile, JSON.stringify(products, null, 2), "utf-8");
      return updated;
    } catch (error) {
      throw new Error("Error al actualizar producto: " + error.message);
    }
  }

  async deleteProductById(productId) {
    try {
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      const products = JSON.parse(fileData);

      const indexProduct = products.findIndex(p => p.id === productId);
      if (indexProduct === -1) return null;

      const deleted = products.splice(indexProduct, 1)[0];

      await fs.writeFile(this.pathFile, JSON.stringify(products, null, 2), "utf-8");
      return deleted;
    } catch (error) {
      throw new Error("Error al eliminar producto: " + error.message);
    }
  }
}

export default ProductManager;