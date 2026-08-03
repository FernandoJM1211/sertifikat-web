const {
  SPREADSHEET_ID,
  getSheetsService,
} = require("./google");

const cache = require("../cache/cacheManager");

const CACHE_DURATION = 5 * 60 * 1000;

/*
=========================================
LOAD SELURUH DATA KEGIATAN
=========================================
*/

async function loadKegiatan() {

  if (
    cache.kegiatan &&
    Date.now() - cache.kegiatanTime < CACHE_DURATION
  ) {
    console.log("✅ Daftar kegiatan dari CACHE");
    return cache.kegiatan;
  }

  if (cache.kegiatanLoading) {
    console.log("⏳ Menunggu cache kegiatan...");
    return cache.kegiatanLoading;
  }

  cache.kegiatanLoading = (async () => {

    console.log("📄 Mengambil daftar kegiatan...");

    const sheets = await getSheetsService();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Kegiatan!A:Z",
    });

    const rows = response.data.values || [];

    if (rows.length < 2) {

      cache.kegiatan = [];
      cache.kegiatanTime = Date.now();

      return [];

    }

    const data = rows
  .slice(1)
  .map(row => ({

    status: row[0] || "",
    kode: row[1] || "",
    nama: row[2] || "",
    flyer: row[3] || "",
    tanggal: row[4] || "",
    waktu: row[5] || "",
    deskripsi: row[6] || "",
    zoom: row[7] || "",
    youtube: row[8] || "",
    virtualBackground: row[9] || "",
    presensi: row[10] || "",
    files: row[11] || "",

  }))
  .filter(item => item.kode);

    cache.kegiatan = data;
    cache.kegiatanTime = Date.now();

    console.log(`📦 ${data.length} kegiatan berhasil dimuat`);

    return data;

  })();

  try {

    return await cache.kegiatanLoading;

  } finally {

    cache.kegiatanLoading = null;

  }

}

/*
=========================================
UNTUK HOMEPAGE
=========================================
*/

async function getDaftarKegiatan() {

    const data = await loadKegiatan();

    return data.map(item => ({

        kode: item.kode,
        nama: item.nama,
        flyer: item.flyer,
        tanggal: item.tanggal,
        status: item.status

    }));

}

/*
=========================================
UNTUK HALAMAN KEGIATAN
=========================================
*/

async function getDetailKegiatan(kode) {

  const data = await loadKegiatan();

  const keyword = String(kode)
    .trim()
    .toUpperCase();

  console.log("🔎 Mencari kode:", keyword);

  console.log(
    "📋 Daftar kode:",
    data.map(item => item.kode)
  );

  return data.find(item =>
    String(item.kode)
      .trim()
      .toUpperCase() === keyword
  );

}

module.exports = {

  getDaftarKegiatan,
  getDetailKegiatan,

};

/*
========================================
TAB NAVIGATION
========================================
*/

function initTabs() {

    const buttons =
        document.querySelectorAll(".tab-button");

    const contents =
        document.querySelectorAll(".tab-content");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            const tab =
                button.dataset.tab;

            buttons.forEach(btn =>
                btn.classList.remove("active")
            );

            contents.forEach(content =>
                content.classList.remove("active")
            );

            button.classList.add("active");

            document
                .getElementById(tab)
                .classList
                .add("active");

        });

    });

}

/*
========================================
SEARCH
========================================
*/

function initSearch() {

    const tombol =
        document.getElementById("btn-cari");

    const input =
        document.getElementById("keyword");

    if (!tombol || !input) return;

    tombol.addEventListener(
        "click",
        cari
    );

    input.addEventListener(
        "keypress",
        function(e){

            if(e.key==="Enter"){

                cari();

            }

        }
    );

}

/*
========================================
CARI SERTIFIKAT
========================================
*/

async function cari(){

    const keyword =
        document
            .getElementById("keyword")
            .value
            .trim();

    if(keyword===""){

        document.getElementById("hasil").innerHTML=`
            <div class="empty-state">

                Masukkan nama peserta.

            </div>
        `;

        return;

    }

    document.getElementById("hasil").innerHTML=`
        <div class="empty-state">

            Mencari data...

        </div>
    `;

    try{

        const data =
            await cariSertifikat(keyword);

        renderHasil(data);

    }

    catch(err){

        console.error(err);

        document.getElementById("hasil").innerHTML=`
            <div class="empty-state">

                Terjadi kesalahan.

            </div>
        `;

    }

}

/*
========================================
WARNA BADGE
========================================
*/

function warnaKegiatan(namaKegiatan){

    const warnaList=[

        "#2563EB",
        "#059669",
        "#D97706",
        "#DC2626",
        "#7C3AED",
        "#0891B2",
        "#DB2777",
        "#4F46E5",
        "#16A34A"

    ];

    let hash=0;

    const text=(namaKegiatan||"").toString();

    for(let i=0;i<text.length;i++){

        hash=text.charCodeAt(i)+((hash<<5)-hash);

    }

    return warnaList[
        Math.abs(hash)%warnaList.length
    ];

}

/*
========================================
RENDER HASIL PENCARIAN
========================================
*/

function renderHasil(data){

    const hasil=
        document.getElementById("hasil");

    if(!hasil) return;

    if(!data || data.length===0){

        hasil.innerHTML=`

            <div class="empty-state">

                Data tidak ditemukan.

            </div>

        `;

        return;

    }

    let html=`

        <div class="hasil-info">

            📌 Ditemukan ${data.length} peserta

        </div>

    `;

    data.forEach(item=>{

        const warna=
            warnaKegiatan(item.kegiatan);

        const tombol=

            item.sertifikat &&
            item.sertifikat.trim()!=="" ?

            `

                <a
                    class="btn-download"
                    href="${item.sertifikat}"
                    target="_blank">

                    Lihat Sertifikat

                </a>

            `

            :

            `

                <span class="status-proses">

                    Sertifikat Masih Diproses

                </span>

            `;

        html+=`

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

                        ${item.instansi||"-"}

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

    hasil.innerHTML=html;

}

/*
========================================
SELESAI
========================================
*/

console.log(
    "✅ kegiatan.js berhasil dimuat"
);