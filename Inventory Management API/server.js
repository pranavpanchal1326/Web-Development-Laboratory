const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let products = [];
let nextId = 1;

// Get all products
app.get('/products', (req, res) => {
  res.json(products);
});

// Get product by ID
app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// Add product
app.post('/products', (req, res) => {
  const product = {
    id: nextId++,
    name: req.body.name,
    quantity: req.body.quantity,
    price: req.body.price
  };
  products.push(product);
  res.status(201).json(product);
});

// Update product
app.put('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ message: 'Product not found' });
  
  product.name = req.body.name || product.name;
  product.quantity = req.body.quantity !== undefined ? req.body.quantity : product.quantity;
  product.price = req.body.price || product.price;
  res.json(product);
});

// Delete product
app.delete('/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Product not found' });
  
  products.splice(index, 1);
  res.json({ message: 'Product deleted' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});