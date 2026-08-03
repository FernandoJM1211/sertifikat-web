/*
=====================================================
PORTAL KEGIATAN DTDP
kegiatan.js
=====================================================
*/

let dataKegiatan = {};

/*
=====================================================
SIDEBAR
=====================================================
*/

function toggleSidebar() {

    document
        .getElementById("sidebar")
        .classList
        .toggle("closed");

}

/*
=====================================================
TAB
=====================================================
*/

function bukaTab(namaTab) {

    document
        .querySelectorAll(".tab-content")
        .forEach(tab => {

            tab.classList.remove("active");

        });

    document
        .querySelectorAll(".nav-button")
        .forEach(button => {

            button.classList.remove("active");

        });

    const tab =
        document.getElementById(
            "tab-" + namaTab
        );

    if (tab) {

        tab.classList.add("active");

    }

    const button =
        document.getElementById(
            "btn-" + namaTab
        );

    if (button) {

        button.classList.add("active");

    }

}

/*
=====================================================
LOAD HALAMAN
=====================================================
*/

window.onload = async function () {

    try {

        const params =
            new URLSearchParams(
                window.location.search
            );

        const kode =
            params.get("kode");

        if (!kode) {

            alert(
                "Kode kegiatan tidak ditemukan."
            );

            window.location.href =
                "home.html";

            return;

        }

        const data =
            await getDetailKegiatan(kode);

        if (!data) {

            alert(
                "Data kegiatan tidak ditemukan."
            );

            window.location.href =
                "home.html";

            return;

        }

        dataKegiatan = data;

        setKegiatan(data);

    }

    catch (err) {

    console.error(err);

    alert(err.message);

}

};

/*
=====================================================
SET DATA KEGIATAN
=====================================================
*/

function setKegiatan(data) {

    document.title =
        data.nama || "Portal Kegiatan DTDP";

    document.getElementById("info-nama").innerText =
        data.nama || "-";

    document.getElementById("info-flyer").src =
        ubahKeThumbnail(data.flyer);

    document.getElementById("info-tanggal").innerText =
        data.tanggal || "-";

    document.getElementById("info-waktu").innerText =
        data.waktu || "-";

    document.getElementById("info-deskripsi").innerText =
        data.deskripsi || "-";

    /*
    ============================
    VIRTUAL BACKGROUND
    ============================
    */

    document.getElementById("btn-vb").href =
        data.virtualBackground || "#";

    document.getElementById("vb-preview").src =
        ubahKeThumbnail(
            data.virtualBackground
        );

    /*
    ============================
    FILES
    ============================
    */

    document.getElementById("link-files").href =
        data.files || "#";

    /*
    ============================
    STREAMING
    ============================
    */

    document.getElementById("link-zoom").href =
        data.zoom || "#";

    document.getElementById("link-youtube").href =
        data.youtube || "#";

    /*
    ============================
    PRESENSI
    ============================
    */

    document.getElementById("link-presensi").href =
        data.presensi || "#";

}

/*
=====================================================
GOOGLE DRIVE THUMBNAIL
=====================================================
*/

function ubahKeThumbnail(link) {

    if (!link) {

        return "";

    }

    const text =
        link.toString().trim();

    /*
    https://drive.google.com/file/d/FILE_ID/view
    */

    const match1 =
        text.match(/\/d\/([^/]+)/);

    /*
    https://drive.google.com/open?id=FILE_ID
    */

    const match2 =
        text.match(/[?&]id=([^&]+)/);

    let id = "";

    if (match1 && match1[1]) {

        id = match1[1];

    }

    else if (match2 && match2[1]) {

        id = match2[1];

    }

    if (id) {

        return `https://drive.google.com/thumbnail?id=${id}&sz=w2000`;

    }

    return text;

}

/*
=====================================================
PENCARIAN SERTIFIKAT
=====================================================
*/

async function cari() {

    const keyword =
        document
            .getElementById("keyword")
            .value
            .trim();

    if (keyword === "") {

        document.getElementById("hasil").innerHTML = `

            <div class="empty-state">

                Silakan masukkan nama peserta terlebih dahulu.

            </div>

        `;

        return;

    }

    document.getElementById("hasil").innerHTML = `

        <div class="empty-state">

            Mencari data...

        </div>

    `;

    try {

        const data =
    await cariSertifikat(
        keyword,
        dataKegiatan.kode
    );

tampilkan(data);

    }

    catch (err) {

        console.error(err);

        document.getElementById("hasil").innerHTML = `

            <div class="empty-state">

                Terjadi kesalahan saat mencari data.

            </div>

        `;

    }

}

/*
=====================================================
WARNA BADGE
=====================================================
*/

function warnaKegiatan(namaKegiatan) {

    const warnaList = [

        "#2563EB",
        "#059669",
        "#D97706",
        "#DC2626",
        "#7C3AED",
        "#0891B2",
        "#DB2777",
        "#4F46E5",
        "#0EA5E9",
        "#16A34A"

    ];

    let hash = 0;

    const text =
        (namaKegiatan || "")
        .toString();

    for (let i = 0; i < text.length; i++) {

        hash =
            text.charCodeAt(i)
            + ((hash << 5) - hash);

    }

    return warnaList[
        Math.abs(hash)
        % warnaList.length
    ];

}

/*
=====================================================
TAMPILKAN HASIL
=====================================================
*/

function tampilkan(data) {

    const hasil =
        document.getElementById("hasil");

    if (!data || data.length === 0) {

        hasil.innerHTML = `

            <div class="empty-state">

                Data tidak ditemukan.
                Pastikan nama yang dimasukkan sudah sesuai.

            </div>

        `;

        return;

    }

    let html = `

        <div class="hasil-info">

            📌 Hasil Pencarian - Ditemukan
            ${data.length} data

        </div>

    `;

    data.forEach(item => {

        let tombol = "";

        if (
            item.sertifikat &&
            item.sertifikat.toString().trim() !== ""
        ) {

            tombol = `

                <a
                    class="btn-download"
                    href="${item.sertifikat}"
                    target="_blank">

                    Lihat Sertifikat

                </a>

            `;

        }

        else {

            tombol = `

                <span class="status-proses">

                    Sertifikat Masih Diproses

                </span>

            `;

        }

        const warna =
            warnaKegiatan(
                item.kegiatan
            );

        html += `

            <div class="result-card">

                <div class="result-data">

                    <div class="label">

                        Nama

                    </div>

                    <div class="value">

                        <strong>

                            ${item.nama}

                        </strong>

                    </div>

                    <div class="label">

                        Instansi

                    </div>

                    <div class="value">

                        ${item.instansi || "-"}

                    </div>

                    <div class="label">

                        Kegiatan

                    </div>

                    <div class="value">

                        <span
                            class="event-badge"
                            style="color:${warna};">

                            ${item.kegiatan}

                        </span>

                    </div>

                </div>

                <div class="action">

                    ${tombol}

                </div>

            </div>

        `;

    });

    hasil.innerHTML = html;

}

/*
=====================================================
FINISH
=====================================================
*/

console.log(
    "✅ kegiatan.js loaded"
);