const API_URL = 'http://localhost:3000/api/contacts';

document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('contactId').value;
    const contact = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value
    };

    if (id) {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contact)
        });
    } else {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contact)
        });
    }

    document.getElementById('contactForm').reset();
    document.getElementById('contactId').value = '';
    loadContacts();
});

async function loadContacts() {
    const response = await fetch(API_URL);
    const contacts = await response.json();
    
    const contactsList = document.getElementById('contactsList');
    contactsList.innerHTML = contacts.map(contact => `
        <div class="contact-item">
            <h3>${contact.name}</h3>
            <p>Email: ${contact.email}</p>
            <p>Phone: ${contact.phone}</p>
            <button class="edit-btn" onclick="editContact('${contact._id}', '${contact.name}', '${contact.email}', '${contact.phone}')">Edit</button>
            <button class="delete-btn" onclick="deleteContact('${contact._id}')">Delete</button>
        </div>
    `).join('');
}

function editContact(id, name, email, phone) {
    document.getElementById('contactId').value = id;
    document.getElementById('name').value = name;
    document.getElementById('email').value = email;
    document.getElementById('phone').value = phone;
}

async function deleteContact(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    loadContacts();
}

loadContacts();