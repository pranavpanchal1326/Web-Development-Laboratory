document.getElementById('eventForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const date = document.getElementById('date').value;
    
    let isValid = true;
    
    // Clear previous errors
    document.getElementById('nameError').textContent = '';
    document.getElementById('phoneError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('dateError').textContent = '';
    document.getElementById('message').style.display = 'none';
    
    // Name validation
    if (name === '') {
        document.getElementById('nameError').textContent = 'Name is required';
        isValid = false;
    }
    
    // Phone validation (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
        document.getElementById('phoneError').textContent = 'Phone must be 10 digits';
        isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('emailError').textContent = 'Enter a valid email address';
        isValid = false;
    }
    
    // Date validation
    if (date === '') {
        document.getElementById('dateError').textContent = 'Date is required';
        isValid = false;
    } else {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            document.getElementById('dateError').textContent = 'Date must be in the future';
            isValid = false;
        }
    }
    
    if (isValid) {
        document.getElementById('message').textContent = 'Registration successful!';
        document.getElementById('message').style.display = 'block';
        document.getElementById('message').style.background = '#d4edda';
        document.getElementById('message').style.color = '#155724';
        document.getElementById('eventForm').reset();
    }
});