import fs from "fs/promises";

class ProductManager {
  constructor(pathFile) {
    this.pathFile = pathFile;
  }

  async getProducts() {
    try {
      const data = await fs.readFile(this.pathFile, "utf-8");
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async addProduct(newProduct) {
    const products = await this.getProducts();
    const id = products.length ? products[products.length - 1].id + 1 : 1;
    const product = { id, ...newProduct };
    products.push(product);
    await fs.writeFile(this.pathFile, JSON.stringify(products, null, 2));
    return product;
  }

 async deleteProduct(id) {
  let products = await this.getProducts();
  products = products.filter((p) => p.id !== id);
  await fs.writeFile(this.pathFile, JSON.stringify(products, null, 2));
}
}

export default ProductManager;
