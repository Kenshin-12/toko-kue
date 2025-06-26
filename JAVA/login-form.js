// File: js/login-form.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const usernameInput = this.elements.username; // Gunakan name attribute
            const passwordInput = this.elements.password; // Gunakan name attribute

            if (usernameInput && passwordInput) {
                const username = usernameInput.value;
                // const password = passwordInput.value; // Password tidak digunakan di simulasi ini
                // Simulasi login berhasil
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('loggedInUser', username);
                alert(`Selamat datang, ${username}! Anda berhasil log in.`);
                window.location.href = 'index.html'; // Arahkan ke halaman utama
            } else {
                alert('Mohon isi username dan password Anda.');
            }
        });
    }
});
