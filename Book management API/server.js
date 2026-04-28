const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory database
let books = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Fiction' },
    { id: 2, title: '1984', author: 'George Orwell', genre: 'Dystopian' }
];

let nextId = 3;

// GET all books
app.get('/api/books', (req, res) => {
    res.json(books);
});

// GET single book by ID
app.get('/api/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
});

// POST create new book
app.post('/api/books', (req, res) => {
    const { title, author, genre } = req.body;
    
    if (!title || !author || !genre) {
        return res.status(400).json({ message: 'Title, author, and genre are required' });
    }
    
    const newBook = {
        id: nextId++,
        title,
        author,
        genre
    };
    
    books.push(newBook);
    res.status(201).json(newBook);
});

// PUT update book
app.put('/api/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }
    
    const { title, author, genre } = req.body;
    
    if (title) book.title = title;
    if (author) book.author = author;
    if (genre) book.genre = genre;
    
    res.json(book);
});

// DELETE book
app.delete('/api/books/:id', (req, res) => {
    const index = books.findIndex(b => b.id === parseInt(req.params.id));
    
    if (index === -1) {
        return res.status(404).json({ message: 'Book not found' });
    }
    
    books.splice(index, 1);
    res.json({ message: 'Book deleted successfully' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});