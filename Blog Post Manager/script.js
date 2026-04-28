const API_URL = 'http://localhost:3000/api/posts';

document.getElementById('postForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('postId').value;
    const post = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        content: document.getElementById('content').value
    };

    if (id) {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(post)
        });
    } else {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(post)
        });
    }

    document.getElementById('postForm').reset();
    document.getElementById('postId').value = '';
    loadPosts();
});

async function loadPosts() {
    const response = await fetch(API_URL);
    const posts = await response.json();
    
    const postsList = document.getElementById('postsList');
    postsList.innerHTML = posts.map(post => `
        <div class="post-item">
            <h3>${post.title}</h3>
            <p><strong>Author:</strong> ${post.author}</p>
            <p>${post.content}</p>
            <small>${new Date(post.createdAt).toLocaleString()}</small><br><br>
            <button class="edit-btn" onclick='editPost("${post._id}", "${post.title.replace(/'/g, "\\'")}","${post.author}", "${post.content.replace(/'/g, "\\'")}")'>Edit</button>
            <button class="delete-btn" onclick="deletePost('${post._id}')">Delete</button>
        </div>
    `).join('');
}

function editPost(id, title, author, content) {
    document.getElementById('postId').value = id;
    document.getElementById('title').value = title;
    document.getElementById('author').value = author;
    document.getElementById('content').value = content;
}

async function deletePost(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    loadPosts();
}

loadPosts();