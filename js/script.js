function bukaTab(namaTab) {

    document.querySelectorAll(".tab-content").forEach(tab => {
        tab.classList.remove("active");
    });

    document.querySelectorAll(".nav-button").forEach(button => {
        button.classList.remove("active");
    });

    document.getElementById("tab-" + namaTab).classList.add("active");
    document.getElementById("btn-" + namaTab).classList.add("active");

}

async function cari() {

    const keyword = document.getElementById("keyword").value;

    if (keyword.trim() === "") {
        document.getElementById("hasil").innerHTML =
            `<div class="empty-state">Silakan masukkan nama peserta terlebih dahulu.</div>`;
        return;
    }

    document.getElementById("hasil").innerHTML =
        `<div class="empty-state">Mencari data...</div>`;

    try {

        const data = await cariSertifikat(keyword);

        tampilkan(data);

    } catch (err) {

        console.error(err);

        document.getElementById("hasil").innerHTML =
            `<div class="empty-state">Terjadi kesalahan saat mencari data.</div>`;

    }

}

function warnaKegiatan(namaKegiatan) {

    const warnaList = [
        "#2563eb",
        "#059669",
        "#d97706",
        "#dc2626",
        "#7c3aed",
        "#0891b2",
        "#db2777",
        "#4f46e5",
        "#0ea5e9",
        "#16a34a"
    ];

    let hash = 0;
    const teks = namaKegiatan.toString();

    for (let i = 0; i < teks.length; i++) {
        hash = teks.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % warnaList.length;

    return warnaList[index];
}

function tampilkan(data) {

    if (!data || data.length === 0) {

        document.getElementById("hasil").innerHTML =
            `<div class="empty-state">Data tidak ditemukan. Pastikan nama yang dimasukkan sudah sesuai.</div>`;

        return;
    }

    let html = `
        <div class="hasil-info">
            📌 Hasil Pencarian - Ditemukan ${data.length} data
        </div>
    `;

    data.forEach(item => {

        let tampilanSertifikat = "";

        if (item.sertifikat && item.sertifikat.toString().trim() !== "") {

            tampilanSertifikat = `
                <a class="btn-download" href="${item.sertifikat}" target="_blank">
                    Lihat Sertifikat
                </a>
            `;

        } else {

            tampilanSertifikat = `
                <span class="status-proses">
                    Sertifikat Masih Diproses
                </span>
            `;

        }

        const warna = warnaKegiatan(item.kegiatan || "");

        html += `
            <div class="result-card">

                <div class="result-data">

                    <div class="label">Nama</div>
                    <div class="value"><strong>${item.nama}</strong></div>

                    <div class="label">Instansi</div>
                    <div class="value">${item.instansi || "-"}</div>

                    <div class="label">Kegiatan</div>
                    <div class="value">
                        <span class="event-badge" style="color:${warna};">
                            ${item.kegiatan}
                        </span>
                    </div>

                </div>

                <div class="action">
                    ${tampilanSertifikat}
                </div>

            </div>
        `;

    });

    document.getElementById("hasil").innerHTML = html;

}

let dataKegiatan = {};

window.onload = async function () {

    try {

        const data = await getKegiatan();

        setKegiatan(data);

    } catch (err) {

        console.error(err);

    }

};

function ubahKeThumbnail(link) {

    if (!link) return "";

    const teks = link.toString().trim();

    const pola1 = teks.match(/\/d\/([^/]+)/);
    const pola2 = teks.match(/[?&]id=([^&]+)/);

    let id = "";

    if (pola1 && pola1[1]) {

        id = pola1[1];

    } else if (pola2 && pola2[1]) {

        id = pola2[1];

    }

    if (id) {

        return "https://drive.google.com/thumbnail?id=" + id + "&sz=w2000";

    }

    return teks;

}

function setKegiatan(data) {

    if (!data) return;

    dataKegiatan = data;

    document.getElementById("info-nama").innerText = data.nama || "-";
    document.getElementById("info-flyer").src = ubahKeThumbnail(data.flyer);
    document.getElementById("info-tanggal").innerText = data.tanggal || "-";
    document.getElementById("info-waktu").innerText = data.waktu || "-";
    document.getElementById("info-deskripsi").innerText = data.deskripsi || "-";

    document.getElementById("btn-vb").href =
        data.virtualBackground || "#";

    document.getElementById("vb-preview").src =
        ubahKeThumbnail(data.virtualBackground);

    document.getElementById("link-files").href =
        data.files || "#";

    const zoom = document.getElementById("link-zoom");
    const youtube = document.getElementById("link-youtube");
    const presensi = document.getElementById("link-presensi");

    if (zoom) zoom.href = data.zoom || "#";
    if (youtube) youtube.href = data.youtube || "#";
    if (presensi) presensi.href = data.presensi || "#";

}

function toggleSidebar() {

    document.getElementById("sidebar").classList.toggle("closed");

}