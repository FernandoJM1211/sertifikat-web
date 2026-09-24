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
STATUS KEGIATAN
=========================================
*/

function getStatusKegiatan(tanggal, waktuMulai, waktuSelesai) {

    if (!tanggal) {

        return {
            text: "-",
            className: "status-finished"
        };

    }

    const eventDate = parseTanggalIndonesia(tanggal);
    const now = new Date();

    eventDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Kegiatan sudah lewat tanggalnya
    if (eventDate < today) {

        return {
            text: "Selesai",
            className: "status-finished"
        };

    }

    // Kegiatan masih akan datang
    if (eventDate > today) {

        return {
            text: "Akan Datang",
            className: "status-coming"
        };

    }

    // Tanggal sama dengan hari ini.
    // Jika waktu belum tersedia, pertahankan status lama.
    if (!waktuMulai || !waktuSelesai) {

        return {
            text: "Hari ini",
            className: "status-today"
        };

    }

    const waktuMulaiDate =
        buatTanggalDenganWaktu(eventDate, waktuMulai);

    const waktuSelesaiDate =
        buatTanggalDenganWaktu(eventDate, waktuSelesai);

    // Sebelum waktu mulai
    if (now < waktuMulaiDate) {

        return {
            text: "Akan Datang",
            className: "status-coming"
        };

    }

    // Setelah waktu selesai
    if (now >= waktuSelesaiDate) {

        return {
            text: "Selesai",
            className: "status-finished"
        };

    }

    // Sedang berlangsung
    return {
        text: "Sedang Berlangsung",
        className: "status-today"
    };

}

function buatTanggalDenganWaktu(tanggal, waktu) {

    const text = String(waktu).trim();

    const match = text.match(
        /^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/i
    );

    const result = new Date(tanggal);

    if (!match) {
        return result;
    }

    let hour = Number(match[1]);
    const minute = Number(match[2]);
    const period = match[3].toUpperCase();

    if (period === "AM") {

        if (hour === 12) {
            hour = 0;
        }

    } else if (hour !== 12) {

        hour += 12;

    }

    result.setHours(hour, minute, 0, 0);

    return result;

}

/*
=========================================
PARSE TANGGAL DD/MM/YYYY
=========================================
*/

function parseTanggalIndonesia(tanggal) {

    const text = String(tanggal).trim();

    const match = text.match(
        /^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/
    );

    if (match) {

        const day = Number(match[1]);
        const month = Number(match[2]) - 1;
        let year = Number(match[3]);

        if (match[3].length === 2) {
            year += 2000;
        }

        return new Date(year, month, day);

    }

    return new Date(tanggal);

}

/*
=========================================
MEMBUAT CARD KEGIATAN
=========================================
*/

function createCard(item) {

    const flyer =
        convertDriveImage(item.flyer);

    const status =
        getStatusKegiatan(
            item.tanggal,
            item.waktu,
            item.waktuSelesai
        );

    return `
        <a
            href="pages/kegiatan.html?kode=${encodeURIComponent(item.kode)}"
            class="kegiatan-card fade-in">

            <div class="card-image">

                <img
                    src="${flyer}"
                    alt="${item.nama}"
                    loading="lazy"
                    decoding="async"
                    draggable="false">

            </div>

            <div class="card-content">

                <div class="card-meta">

                    <div class="card-date">
                        📅 ${item.tanggal}
                    </div>

                    <div class="card-status ${status.className}">
                        ${status.text}
                    </div>

                </div>

                <h3>
                    ${item.nama}
                </h3>

            </div>

        </a>
    `;

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
