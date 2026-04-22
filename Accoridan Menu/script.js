$(document).ready(function() {
    $('.accordion-header').click(function() {
        // Close all other accordion items
        $('.accordion-content').not($(this).next()).slideUp(300);
        
        // Toggle the clicked accordion item
        $(this).next('.accordion-content').slideToggle(300);
    });
});