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

document.addEventListener("DOMContentLoaded", async () => {

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

});

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

    const flyer =
    document.getElementById("info-flyer");

flyer.src =
    ubahKeThumbnail(data.flyer);

flyer.onerror = () => {

    flyer.src = "../images/logo-lan.png";

};

    document.getElementById("info-tanggal").innerText =
        data.tanggal || "-";


    const status =
    getStatusKegiatan(data.tanggal);

const badge =
    document.getElementById("info-status");

badge.innerText =
    status.text;

badge.className =
    `status-badge ${status.className}`;

    document.getElementById("info-waktu").innerText =
        data.waktu || "-";

    document.getElementById("info-deskripsi").innerText =
        data.deskripsi || "-";

    /*
    ============================
    VIRTUAL BACKGROUND
    ============================
    */

    setLink(
    "btn-vb",
    data.virtualBackground
);

    const vb =
    document.getElementById("vb-preview");

vb.src =
    ubahKeThumbnail(
        data.virtualBackground
    );

vb.onerror = () => {

    vb.src = "../images/logo-lan.png";

};

    /*
    ============================
    FILES
    ============================
    */

    setLink(
    "link-files",
    data.files
);

    /*
    ============================
    STREAMING
    ============================
    */

    setLink(
    "link-zoom",
    data.zoom
);

    setLink(
    "link-youtube",
    data.youtube
);

    /*
    ============================
    PRESENSI
    ============================
    */

    setLink(
    "link-presensi",
    data.presensi
);

}

function getStatusKegiatan(tanggal) {

    if (!tanggal) {

        return {

            text: "-",
            className: "status-finished"

        };

    }

    const eventDate =
        new Date(tanggal);

    const today =
        new Date();

    eventDate.setHours(0,0,0,0);

    today.setHours(0,0,0,0);

    if(eventDate.getTime() === today.getTime()){

        return{

            text:"Hari ini",

            className:"status-today"

        };

    }

    if(eventDate > today){

        return{

            text:"Akan Datang",

            className:"status-coming"

        };

    }

    return{

        text:"Selesai",

        className:"status-finished"

    };

}

/*
=====================================================
AKTIF / NONAKTIF LINK
=====================================================
*/

function setLink(id, url) {

    const element =
        document.getElementById(id);

    if (!element) {

        return;

    }

    if (url && url.trim() !== "") {

        element.href = url;

        element.classList.remove("disabled");

        element.removeAttribute("aria-disabled");

    }

    else {

        element.removeAttribute("href");

        element.classList.add("disabled");

        element.setAttribute(
            "aria-disabled",
            "true"
        );

    }

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

        return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;

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

<div class="loading-search">

    <div class="spinner"></div>

    <p>

        Sedang mencari sertifikat...

    </p>

</div>

`;

    try {

        const data = await cariSertifikat(

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
