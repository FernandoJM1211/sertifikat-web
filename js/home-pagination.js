
/* =========================================
   PENCARIAN DAN PAGINATION KEGIATAN
========================================= */

(() => {
    const PER_PAGE = 6;

    const grid = document.getElementById("kegiatan-grid");
    const pagination = document.getElementById("kegiatan-pagination");
    const searchInput = document.getElementById("kegiatan-search-input");

    if (!grid || !pagination || !searchInput) return;

    let currentPage = 1;

    // Elemen pesan ketika pencarian tidak menemukan hasil
    const emptyMessage = document.createElement("div");
    emptyMessage.className = "kegiatan-search-empty";
    emptyMessage.textContent = "Kegiatan tidak ditemukan. Coba kata kunci lain.";
    emptyMessage.style.display = "none";

    grid.insertAdjacentElement("afterend", emptyMessage);

    function render() {
        const allCards = Array.from(
            grid.querySelectorAll(".kegiatan-card")
        );

        const keyword = searchInput.value
            .trim()
            .toLocaleLowerCase("id-ID");

        // Filter berdasarkan teks pada kartu kegiatan
        const filteredCards = allCards.filter(card =>
            card.textContent
                .toLocaleLowerCase("id-ID")
                .includes(keyword)
        );

        const totalPages = Math.ceil(filteredCards.length / PER_PAGE);

        if (totalPages === 0) {
            currentPage = 1;
        } else {
            currentPage = Math.min(currentPage, totalPages);
        }

        // Sembunyikan seluruh kartu terlebih dahulu
        allCards.forEach(card => {
            card.style.display = "none";
        });

        // Tampilkan maksimal enam kartu pada halaman aktif
        const startIndex = (currentPage - 1) * PER_PAGE;
        const pageCards = filteredCards.slice(
            startIndex,
            startIndex + PER_PAGE
        );

        pageCards.forEach(card => {
            card.style.display = "";
        });

        // Pesan jika pencarian tidak menemukan kegiatan
        const skeleton = document.getElementById("kegiatan-skeleton");
const isLoading =
    skeleton &&
    skeleton.style.display !== "none" &&
    skeleton.children.length > 0;

emptyMessage.style.display =
    !isLoading && allCards.length > 0 && filteredCards.length === 0
        ? "block"
        : "none";

        // Buat navigasi halaman
        if (totalPages <= 1) {
            pagination.innerHTML = "";
            return;
        }

        pagination.innerHTML = `
            <button
                type="button"
                data-page="${currentPage - 1}"
                ${currentPage === 1 ? "disabled" : ""}>
                Sebelumnya
            </button>

            ${Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1;

                return `
                    <button
                        type="button"
                        data-page="${page}"
                        class="${page === currentPage ? "active" : ""}"
                        ${page === currentPage ? 'aria-current="page"' : ""}>
                        ${page}
                    </button>
                `;
            }).join("")}

            <button
                type="button"
                data-page="${currentPage + 1}"
                ${currentPage === totalPages ? "disabled" : ""}>
                Selanjutnya
            </button>
        `;
    }

    // Pencarian langsung ketika pengguna mengetik
    searchInput.addEventListener("input", () => {
        currentPage = 1;
        render();
    });

    // Navigasi pagination
    pagination.addEventListener("click", event => {
        const button = event.target.closest("button[data-page]");

        if (!button || button.disabled) return;

        currentPage = Number(button.dataset.page);
        render();

        document.querySelector(".section-header")?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });

    // Deteksi saat home.js selesai membuat atau memperbarui kartu
    const observer = new MutationObserver(() => {
        currentPage = 1;
        render();
    });

    observer.observe(grid, {
        childList: true
    });

    // Render awal
    render();
})();
