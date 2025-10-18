document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.links');
    const menuIcon = menuToggle && menuToggle.querySelector('i');
    const bookingForm = document.getElementById('booking-form');
    const yearEl = document.getElementById('year');

    // set year in footer if present
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Mobile menu toggle
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            if (menuIcon) {
                menuIcon.classList.toggle('fa-times');
                menuIcon.classList.toggle('fa-bars');
            }
        });
    }

    // Smooth scroll for all internal anchor links
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({behavior: 'smooth', block: 'start'});
                // close mobile menu if open and a link is clicked
                if (navLinks && navLinks.classList.contains('active')) {
                   navLinks.classList.remove('active');
                   if (menuIcon) {
                       menuIcon.classList.remove('fa-times');
                       menuIcon.classList.add('fa-bars');
                   }
                }
            }
        });
    });

    // Booking form (demo)
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const nm = bookingForm.name.value.trim() || 'Guest';
            const ph = bookingForm.phone.value.trim() || 'N/A';
            // In a real application, you would not use alert.
            // This is kept from the original for demonstration.
            alert(`Thanks ${nm}! Your booking request has been received. We will contact you shortly on ${ph}.`);
            bookingForm.reset();
        });
    }
});
