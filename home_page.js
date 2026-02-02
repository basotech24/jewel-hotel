document.addEventListener('DOMContentLoaded', function () {
  // Elements
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.links');
  const menuIcon = menuToggle && menuToggle.querySelector('i');
  const bookingForm = document.getElementById('booking-form');
  const yearEl = document.getElementById('year');
  const mobileBookBtn = document.getElementById('bknw');

  // Set year in footer if present
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile "Book Now" button scroll
  if (mobileBookBtn) {
    mobileBookBtn.addEventListener('click', () => {
      const target = document.querySelector('#contact');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Mobile menu toggle
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      navLinks.classList.toggle('active');
      if (menuIcon) {
        menuIcon.classList.toggle('fa-times');
        menuIcon.classList.toggle('fa-bars');
      }
    });
  }

  // Smooth scroll for all internal anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

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

  // Booking form -> WhatsApp
  if (bookingForm) {
    const waLink = document.getElementById('wa-link');
    const statusEl = document.getElementById('form-status');

    const HOTEL_WA = "2347088914893"; // your WhatsApp number (no +)

    function setStatus(msg, ok = true) {
      if (!statusEl) return;
      statusEl.textContent = msg;
      statusEl.classList.toggle("error", !ok);
    }

    function normalizePhone(p) {
      return (p || "").replace(/[^\d+]/g, ""); // keep digits and +
    }

    function isValidDateRange(checkin, checkout) {
      if (!checkin || !checkout) return false;
      const inD = new Date(checkin);
      const outD = new Date(checkout);
      return outD > inD; // checkout must be after checkin
    }

    function buildBookingId() {
      return "GJH-" + Date.now().toString().slice(-6);
    }

    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = bookingForm.name.value.trim();
      const phone = normalizePhone(bookingForm.phone.value.trim());
      const checkin = bookingForm.checkin.value;
      const checkout = bookingForm.checkout.value;
      const message = bookingForm.message.value.trim();

      // Validation
      if (!name) return setStatus("Please enter your full name.", false);
      if (!phone) return setStatus("Please enter your phone number.", false);
      if (!checkin) return setStatus("Please select your check-in date.", false);
      if (!checkout) return setStatus("Please select your check-out date.", false);
      if (!isValidDateRange(checkin, checkout)) {
        return setStatus("Check-out date must be after check-in date.", false);
      }

      const bookingId = buildBookingId();

      const text =
`Hello Gombe Jewel Hotel Kaduna,
I want to book a room.

Name: ${name}
Phone: ${phone}
Check-in: ${checkin}
Check-out: ${checkout}
Booking ID: ${bookingId}
Request: ${message || "None"}

Please confirm availability and price.`;

      const url = `https://api.whatsapp.com/send?phone=${HOTEL_WA}&text=${encodeURIComponent(text)}`;


      // show button for browsers that block popups
      if (waLink) {
        waLink.href = url;
        waLink.style.display = "inline-flex";
      }

      setStatus("WhatsApp opened. Please tap SEND to complete your booking.", true);

      // Try auto-open WhatsApp
      const win = window.open(url, "_blank", "noopener");
      if (!win) {
        // popup blocked
        setStatus("Popup blocked. Please click “Continue on WhatsApp” button below.", false);
      }
    });
  }
});

