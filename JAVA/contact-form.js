// File: js/contact-form.js
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(this);
            const name = formData.get('fullName');
            // const email = formData.get('email');
            // const questions = formData.get('questions');
            // console.log('Contact Form Submitted:', { name, email, questions });
            alert(`Terima kasih, ${name}! Pesan Anda telah terkirim (simulasi).`);
            this.reset();
        });
    }
});
