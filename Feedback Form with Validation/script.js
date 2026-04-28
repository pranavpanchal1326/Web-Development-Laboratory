document.getElementById('feedbackForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const rating = document.getElementById('rating').value;
    const comments = document.getElementById('comments').value.trim();
    
    let isValid = true;
    
    // Clear previous errors
    document.getElementById('nameError').textContent = '';
    document.getElementById('ratingError').textContent = '';
    document.getElementById('commentsError').textContent = '';
    document.getElementById('message').style.display = 'none';
    
    // Name validation
    if (name === '') {
        document.getElementById('nameError').textContent = 'Name is required';
        isValid = false;
    } else if (name.length < 2) {
        document.getElementById('nameError').textContent = 'Name must be at least 2 characters';
        isValid = false;
    }
    
    // Rating validation
    if (rating === '') {
        document.getElementById('ratingError').textContent = 'Rating is required';
        isValid = false;
    } else if (rating < 1 || rating > 5) {
        document.getElementById('ratingError').textContent = 'Rating must be between 1 and 5';
        isValid = false;
    }
    
    // Comments validation
    if (comments === '') {
        document.getElementById('commentsError').textContent = 'Comments are required';
        isValid = false;
    } else if (comments.length < 10) {
        document.getElementById('commentsError').textContent = 'Comments must be at least 10 characters';
        isValid = false;
    }
    
    if (isValid) {
        document.getElementById('message').textContent = 'Feedback submitted successfully!';
        document.getElementById('message').style.display = 'block';
        document.getElementById('message').style.background = '#d4edda';
        document.getElementById('message').style.color = '#155724';
        document.getElementById('feedbackForm').reset();
    }
});