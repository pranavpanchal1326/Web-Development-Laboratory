$(document).ready(function() {
    $('.filter-btn').click(function() {
        const filter = $(this).data('filter');
        
        // Update active button
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        
        // Filter gallery items
        if (filter === 'all') {
            $('.gallery-item').fadeIn(300);
        } else {
            $('.gallery-item').each(function() {
                if ($(this).data('category') === filter) {
                    $(this).fadeIn(300);
                } else {
                    $(this).fadeOut(300);
                }
            });
        }
    });
});