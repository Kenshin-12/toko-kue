// File: js/menu-logic.js
document.addEventListener('DOMContentLoaded', () => {
    const sortProductSelect = document.getElementById('sort-product');
    const productGrid = document.querySelector('.product-grid.menu-items');
    const categoryButtons = document.querySelectorAll('.category-button');
    const findProductInput = document.getElementById('find-product');

    if (!productGrid || !sortProductSelect || !findProductInput || categoryButtons.length === 0) {
        return; // Hanya jalankan jika elemen menu ada
    }

    // Ambil semua kartu produk dari HTML sebagai dasar
    const allProductCardsOriginal = Array.from(productGrid.querySelectorAll('.product-card'));

    function applyFiltersAndSort() {
        const selectedCategory = document.querySelector('.category-button.active')?.dataset.category || 'all';
        const searchTerm = findProductInput.value.toLowerCase();

        let filteredCards = allProductCardsOriginal.filter(card => {
            const cardCategory = card.dataset.category;
            const productName = card.querySelector('h4').textContent.toLowerCase();
            // const productDescription = card.querySelector('p').textContent.toLowerCase(); // Opsional: cari di deskripsi juga

            const categoryMatch = (selectedCategory === 'all' || cardCategory === selectedCategory);
            const searchMatch = (productName.includes(searchTerm) /*|| productDescription.includes(searchTerm)*/);
            return categoryMatch && searchMatch;
        });

        const sortBy = sortProductSelect.value;
        filteredCards.sort((a, b) => {
            const nameA = a.querySelector('h4').textContent.toLowerCase();
            const nameB = b.querySelector('h4').textContent.toLowerCase();
            const priceA = parseInt(a.querySelector('.price').textContent.replace(/Rp\s|\./g, ''));
            const priceB = parseInt(b.querySelector('.price').textContent.replace(/Rp\s|\./g, ''));

            switch (sortBy) {
                case 'name-asc': return nameA.localeCompare(nameB);
                case 'name-desc': return nameB.localeCompare(nameA);
                case 'price-asc': return priceA - priceB;
                case 'price-desc': return priceB - priceA;
                default: return 0;
            }
        });

        productGrid.innerHTML = ''; // Kosongkan grid
        if (filteredCards.length > 0) {
            filteredCards.forEach(card => productGrid.appendChild(card));
        } else {
            productGrid.innerHTML = '<p style="text-align:center; width:100%;">Tidak ada produk yang cocok dengan kriteria Anda.</p>';
        }
    }

    sortProductSelect.addEventListener('change', applyFiltersAndSort);
    findProductInput.addEventListener('input', applyFiltersAndSort);

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.querySelector('.category-button.active').classList.remove('active');
            button.classList.add('active');
            applyFiltersAndSort();
        });
    });

    applyFiltersAndSort(); // Panggil saat halaman dimuat
});
