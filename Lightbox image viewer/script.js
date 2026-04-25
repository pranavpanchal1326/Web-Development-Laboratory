$(document).ready(function() {
    let currentIndex = 0;
    const images = $('.gallery-item');

    function showLightbox(index) {
        currentIndex = index;
        const imageText = $(images[index]).data('image');
        $('#lightbox-image').text(imageText);
        $('#lightbox').fadeIn(300);
    }

    $('.gallery-item').click(function() {
        const index = $(this).index();
        showLightbox(index);
    });

    $('.close').click(function() {
        $('#lightbox').fadeOut(300);
    });

    $('.next').click(function() {
        currentIndex = (currentIndex + 1) % images.length;
        const imageText = $(images[currentIndex]).data('image');
        $('#lightbox-image').text(imageText);
    });

    $('.prev').click(function() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        const imageText = $(images[currentIndex]).data('image');
        $('#lightbox-image').text(imageText);
    });

    // Close on background click
    $('#lightbox').click(function(e) {
        if (e.target === this) {
            $(this).fadeOut(300);
        }
    });
});