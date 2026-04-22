const API_URL = 'http://localhost:3000/api/books';

document.getElementById('bookForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('bookId').value;
    const book = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        price: document.getElementById('price').value
    };

    if (id) {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(book)
        });
    } else {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(book)
        });
    }

    document.getElementById('bookForm').reset();
    document.getElementById('bookId').value = '';
    loadBooks();
});

async function loadBooks() {
    const response = await fetch(API_URL);
    const books = await response.json();
    
    const booksList = document.getElementById('booksList');
    booksList.innerHTML = books.map(book => `
        <div class="book-item">
            <h3>${book.title}</h3>
            <p>Author: ${book.author}</p>
            <p>Price: $${book.price}</p>
            <button class="edit-btn" onclick="editBook('${book._id}', '${book.title}', '${book.author}', ${book.price})">Edit</button>
            <button class="delete-btn" onclick="deleteBook('${book._id}')">Delete</button>
        </div>
    `).join('');
}

function editBook(id, title, author, price) {
    document.getElementById('bookId').value = id;
    document.getElementById('title').value = title;
    document.getElementById('author').value = author;
    document.getElementById('price').value = price;
}

async function deleteBook(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    loadBooks();
}

loadBooks();