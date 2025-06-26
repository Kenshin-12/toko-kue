document.addEventListener('DOMContentLoaded', () => {
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    async function loadTemplate(templatePath, placeholderElement) {
        if (!placeholderElement) return false;

        try {
            const response = await fetch(templatePath);
            if (!response.ok) throw new Error(`Gagal memuat ${templatePath}: ${response.status} ${response.statusText}`);
            const templateHTML = await response.text();
            placeholderElement.innerHTML = templateHTML;
            return true;
        } catch (error) {
            console.error(`Error saat memuat ${templatePath}:`, error);
            placeholderElement.innerHTML = `<p style="color:red; text-align:center;">Gagal memuat bagian ini.</p>`;
            return false;
        }
    }

    async function initializePageLayout() {
        // Load navbar and footer templates
        const navbarLoaded = await loadTemplate('/templates/navbar.html', navbarPlaceholder);
        await loadTemplate('/templates/footer.html', footerPlaceholder);

        // Initialize navbar logic only after it's loaded into the DOM
        if (navbarLoaded) {
            initializeNavbarLogic();
        }
    }

    function initializeNavbarLogic() {
        const hamburgerMenu = document.getElementById('hamburger-menu');
        const mainNav = document.getElementById('main-nav');
        const loginButtonNav = document.getElementById('auth-button');
        const navMenuItem = document.getElementById('nav-menu-item');
        const navPromoItem = document.getElementById('nav-promo-item');
        
        // Dapatkan tombol close menu. Pastikan tombol ini sudah ada di navbar.html
        // Jika tidak ada, script akan membuatnya secara dinamis.
        let closeMenuButton = document.getElementById('close-menu');
        
        // Hapus bagian ini jika Anda sudah membuat tombol close di HTML
        // Jika Anda ingin membuat tombolnya secara dinamis, biarkan kode ini dan hapus dari HTML
        if (!closeMenuButton) {
            closeMenuButton = document.createElement('button');
            closeMenuButton.id = 'close-menu';
            closeMenuButton.innerHTML = '&times;'; // HTML entity for 'X'
            closeMenuButton.setAttribute('aria-label', 'Close Menu');
            mainNav.prepend(closeMenuButton); // Add to the top of the nav menu
        }

        // Fungsi untuk membuka menu
        const openNavMenu = () => {
            mainNav.classList.add('active'); // Tambahkan class active untuk menggeser menu masuk
            document.body.classList.add('nav-open'); // Tambahkan class ke body untuk overlay dan overflow:hidden
        };

        // Fungsi untuk menutup menu
        const closeNavMenu = () => {
            mainNav.classList.remove('active'); // Hapus class active untuk menggeser menu keluar
            document.body.classList.remove('nav-open'); // Hapus class dari body
        };

        // Event listener untuk tombol hamburger (membuka menu)
        if (hamburgerMenu) {
            hamburgerMenu.addEventListener('click', openNavMenu);
        }

        // Event listener untuk tombol close (menutup menu)
        if (closeMenuButton) {
            closeMenuButton.addEventListener('click', closeNavMenu);
        }

        // Event listener untuk menutup menu saat mengklik tautan di dalamnya
        document.querySelectorAll('#main-nav ul li a').forEach(link => {
            link.addEventListener('click', closeNavMenu);
        });

        // Event listener untuk menutup menu saat mengklik di luar area menu
        // Kami menggunakan event "mousedown" untuk menghindari masalah dengan click event yang berpasangan.
        document.addEventListener('mousedown', (event) => {
            // Periksa apakah menu sedang aktif dan klik terjadi di luar menu serta tombol hamburger
            if (mainNav.classList.contains('active') && !mainNav.contains(event.target) && !hamburgerMenu.contains(event.target)) {
                closeNavMenu();
            }
        });
        
        // Event listener untuk menutup menu saat ukuran layar berubah ke desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeNavMenu();
            }
        });

        // Update menu & tombol login/logout sesuai status login
        function updateNavbarBasedOnLoginStatus() {
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

            if (isLoggedIn) {
                if (navMenuItem) navMenuItem.style.display = 'list-item';
                if (navPromoItem) navPromoItem.style.display = 'list-item';
                if (loginButtonNav) {
                    loginButtonNav.textContent = 'Log Out';
                    loginButtonNav.href = '#';
                    loginButtonNav.removeEventListener('click', handleLoginRedirect);
                    loginButtonNav.addEventListener('click', handleLogoutClick);
                }
            } else {
                if (navMenuItem) navMenuItem.style.display = 'none';
                if (navPromoItem) navPromoItem.style.display = 'none';
                if (loginButtonNav) {
                    loginButtonNav.textContent = 'Log In';
                    loginButtonNav.href = 'login.html';
                    loginButtonNav.removeEventListener('click', handleLogoutClick);
                    loginButtonNav.addEventListener('click', handleLoginRedirect);
                }
            }

            updateActiveNavLink();
        }

        function handleLoginRedirect(event) {
            // Tidak perlu preventDefault karena akan pindah ke login.html
        }

        function handleLogoutClick(event) {
            event.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('loggedInUser');
            updateNavbarBasedOnLoginStatus();
            window.location.href = 'login.html';
        }

        function updateActiveNavLink() {
            const currentPageFile = window.location.pathname.split('/').pop() || 'index.html';
            document.querySelectorAll('#main-nav a, #auth-button').forEach(link => {
                link.classList.remove('active');
                const linkListItem = link.closest('li');
                if (linkListItem && linkListItem.style.display === 'none') return;

                const linkFile = new URL(link.href, window.location.origin).pathname.split('/').pop() || 'index.html';
                if (linkFile === currentPageFile) link.classList.add('active');
            });
        }

        updateNavbarBasedOnLoginStatus();
    }

    initializePageLayout();
});