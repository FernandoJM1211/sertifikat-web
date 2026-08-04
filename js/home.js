/*
=========================================
LOAD DAFTAR KEGIATAN
=========================================
*/

async function loadKegiatan() {

    const skeleton =
        document.getElementById("kegiatan-skeleton");

    const grid =
        document.getElementById("kegiatan-grid");

    const empty =
        document.getElementById("empty-state");

    /*
    =========================
    RESET STATE
    =========================
    */

    skeleton.classList.remove("fade-out");
    grid.classList.remove("fade-in");
    empty.classList.remove("fade-in");

    skeleton.style.display = "grid";
    grid.style.display = "none";
    empty.style.display = "none";

    grid.innerHTML = "";
    skeleton.innerHTML = "";

    /*
    =========================
    SKELETON
    =========================
    */

    const skeletonCount =
        window.innerWidth <= 768 ? 2 : 3;

    for (let i = 0; i < skeletonCount; i++) {

        skeleton.insertAdjacentHTML(

            "beforeend",

            `

            <div class="skeleton-card">

                <div class="skeleton-image"></div>

                <div class="skeleton-content">

                    <div class="skeleton-line short"></div>

                    <div class="skeleton-line long"></div>

                    <div class="skeleton-line medium"></div>

                </div>

            </div>

            `

        );

    }

    /*
    =========================
    FETCH API
    =========================
    */

    try {

        const response =
            await fetch("/api/kegiatan-list");

        const result =
            await response.json();

        skeleton.classList.add("fade-out");

        setTimeout(() => {

            skeleton.style.display = "none";

            if (!result.success) {

                grid.style.display = "block";

                showError(
                    grid,
                    result.message
                );

                return;

            }

            renderKegiatan(result.data);

        }, 200);

    }

    catch (err) {

        console.error(err);

        skeleton.classList.add("fade-out");

        setTimeout(() => {

            skeleton.style.display = "none";

            grid.style.display = "block";

            showError(
                grid,
                "Gagal mengambil data kegiatan."
            );

        }, 200);

    }

}

/*
=========================================
RENDER KEGIATAN
=========================================
*/

function renderKegiatan(kegiatan) {

    const grid =
        document.getElementById("kegiatan-grid");

    const empty =
        document.getElementById("empty-state");

    grid.innerHTML = "";

    empty.style.display = "none";

    grid.classList.remove("fade-in");
    empty.classList.remove("fade-in");

    /*
    =========================
    EMPTY
    =========================
    */

    if (!kegiatan.length) {

        empty.style.display = "block";

        empty.classList.add("fade-in");

        return;

    }

    /*
    =========================
    GRID
    =========================
    */

    grid.style.display = "grid";

    grid.classList.add("fade-in");

    kegiatan.forEach(item => {

        grid.insertAdjacentHTML(

            "beforeend",

            createCard(item)

        );

    });

}

/*
=========================================
MEMBUAT CARD KEGIATAN
=========================================
*/

function createCard(item) {

    const flyer =
        convertDriveImage(item.flyer);

    return `

        <div
            class="kegiatan-card fade-in"
            onclick="bukaKegiatan('${item.kode}')">

            <div class="card-image">

                <img
                    src="${flyer}"
                    alt="${item.nama}"
                    loading="lazy"
                    decoding="async">

            </div>

            <div class="card-content">

                <div class="card-date">

                    📅 ${item.tanggal}

                </div>

                <h3>

                    ${item.nama}

                </h3>

            </div>

        </div>

    `;

}

/*
=========================================
BUKA HALAMAN KEGIATAN
=========================================
*/

function bukaKegiatan(kode) {

    window.location.href =
        `kegiatan.html?kode=${encodeURIComponent(kode)}`;

}

/*
=========================================
KONVERSI LINK GOOGLE DRIVE
=========================================
*/

function convertDriveImage(url) {

    if (!url) {

        return "";

    }

    const text =
        String(url).trim();

    const match1 =
        text.match(/\/d\/([^/]+)/);

    const match2 =
        text.match(/[?&]id=([^&]+)/);

    let id = "";

    if (match1) {

        id = match1[1];

    }

    else if (match2) {

        id = match2[1];

    }

    if (!id) {

        return text;

    }

    return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;

}

/*
=========================================
ERROR
=========================================
*/

function showError(container, message) {

    container.innerHTML = `

        <div class="error">

            ${message}

        </div>

    `;

}

/*
=========================================
INIT
=========================================
*/

document.addEventListener(

    "DOMContentLoaded",

    loadKegiatan

);