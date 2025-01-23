// Importar las dependencias necesarias
const express = require('express');
const fs = require('fs/promises');
const path = require('path');

// Configuración inicial
const app = express();
app.use(express.json());

const productsRouter = express.Router();
const cartsRouter = express.Router();

const PRODUCTS_FILE = path.join(__dirname, 'productos.json');
const CARTS_FILE = path.join(__dirname, 'carrito.json');

// Función para leer archivos JSON
const readFile = async (file) => {
    try {
        const data = await fs.readFile(file, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
};

// Función para escribir archivos JSON
const writeFile = async (file, data) => {
    await fs.writeFile(file, JSON.stringify(data, null, 2));
};

// Rutas para /api/products
productsRouter.get('/', async (req, res) => {
    const { limit } = req.query;
    const products = await readFile(PRODUCTS_FILE);
    if (limit) {
        return res.json(products.slice(0, Number(limit)));
    }
    res.json(products);
});

productsRouter.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    const products = await readFile(PRODUCTS_FILE);
    const product = products.find((p) => p.id === pid);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
});

productsRouter.post('/', async (req, res) => {
    const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;
    if (!title || !description || !code || !price || stock === undefined || !category) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    const products = await readFile(PRODUCTS_FILE);
    const id = (products.length > 0 ? Number(products[products.length - 1].id) + 1 : 1).toString();
    const newProduct = { id, title, description, code, price, status, stock, category, thumbnails };
    products.push(newProduct);
    await writeFile(PRODUCTS_FILE, products);
    res.status(201).json(newProduct);
});

productsRouter.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const updates = req.body;
    const products = await readFile(PRODUCTS_FILE);
    const productIndex = products.findIndex((p) => p.id === pid);
    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }
    if (updates.id) {
        return res.status(400).json({ message: 'ID cannot be updated' });
    }
    products[productIndex] = { ...products[productIndex], ...updates };
    await writeFile(PRODUCTS_FILE, products);
    res.json(products[productIndex]);
});

productsRouter.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    const products = await readFile(PRODUCTS_FILE);
    const updatedProducts = products.filter((p) => p.id !== pid);
    if (products.length === updatedProducts.length) {
        return res.status(404).json({ message: 'Product not found' });
    }
    await writeFile(PRODUCTS_FILE, updatedProducts);
    res.status(204).send();
});

// Rutas para /api/carts
cartsRouter.post('/', async (req, res) => {
    const carts = await readFile(CARTS_FILE);
    const id = (carts.length > 0 ? Number(carts[carts.length - 1].id) + 1 : 1).toString();
    const newCart = { id, products: [] };
    carts.push(newCart);
    await writeFile(CARTS_FILE, carts);
    res.status(201).json(newCart);
});

cartsRouter.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    const carts = await readFile(CARTS_FILE);
    const cart = carts.find((c) => c.id === cid);
    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }
    res.json(cart.products);
});

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const carts = await readFile(CARTS_FILE);
    const cart = carts.find((c) => c.id === cid);
    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }
    const product = cart.products.find((p) => p.product === pid);
    if (product) {
        product.quantity += 1;
    } else {
        cart.products.push({ product: pid, quantity: 1 });
    }
    await writeFile(CARTS_FILE, carts);
    res.status(200).json(cart);
});

// Montar los routers
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Escuchar en el puerto 8080
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});