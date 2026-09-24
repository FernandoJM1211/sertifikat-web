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
  document.getElementById("sidebar").classList.toggle("closed");
}

/*
=====================================================
TAB
=====================================================
*/

function bukaTab(namaTab) {
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active");
  });

  document.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.remove("active");
  });

  const tab = document.getElementById("tab-" + namaTab);

  if (tab) {
    tab.classList.add("active");
  }

  const button = document.getElementById("btn-" + namaTab);

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
    const params = new URLSearchParams(window.location.search);

    const kode = params.get("kode");

    if (!kode) {
      alert("Kode kegiatan tidak ditemukan.");

      window.location.href = "home.html";

      return;
    }

    const data = await getDetailKegiatan(kode);

    if (!data) {
      alert("Data kegiatan tidak ditemukan.");

      window.location.href = "home.html";

      return;
    }

    dataKegiatan = data;

    setKegiatan(data);
  } catch (err) {
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
  document.title = data.nama || "Portal Kegiatan DTDP";

  document.getElementById("info-nama").innerText = data.nama || "-";

  const flyer = document.getElementById("info-flyer");

  flyer.src = ubahKeThumbnail(data.flyer);

  flyer.onerror = () => {
    flyer.src = "../images/logo-lan.png";
  };

  document.getElementById("info-tanggal").innerText = formatTanggal(data.tanggal);

  const status = getStatusKegiatan(
    data.tanggal,
    data.waktu,
    data.waktuSelesai
  );

  const badge = document.getElementById("info-status");

  badge.innerText = status.text;

  badge.className = `status-badge ${status.className}`;

  document.getElementById("info-waktu").innerText = formatRentangWaktu(data.waktu, data.waktuSelesai);

  document.getElementById("info-deskripsi").innerText = data.deskripsi || "-";

  /*
    ============================
    VIRTUAL BACKGROUND
    ============================
    */

  setLink("btn-vb", data.virtualBackground);

  const vb = document.getElementById("vb-preview");

  vb.src = ubahKeThumbnail(data.virtualBackground);

  vb.onerror = () => {
    vb.src = "../images/logo-lan.png";
  };

  /*
    ============================
    FILES
    ============================
    */

  setLink("link-files", data.files);

  /*
    ============================
    STREAMING
    ============================
    */

  setLink("link-zoom", data.zoom);

  setLink("link-youtube", data.youtube);

  /*
    ============================
    PRESENSI
    ============================
    */

  /*
============================
PRESENSI
============================
*/

  setLink("link-presensi", data.presensi);

  const btnPresensi = document.getElementById("link-presensi");

  const infoPresensi = document.getElementById("presensi-info");

  const infoPenutupan = getOrCreatePresensiPenutupanInfo(btnPresensi);

  if (data.presensi && data.presensi.trim() !== "") {
    btnPresensi.innerText = "Isi Presensi";

    btnPresensi.classList.remove("btn-presensi-disabled");

    infoPresensi.innerText =
      "Silakan mengisi daftar hadir kegiatan melalui tautan presensi berikut.";
  } else {
    btnPresensi.innerText = "Presensi Ditutup";

    btnPresensi.classList.add("btn-presensi-disabled");

    infoPresensi.innerText =
      "Tautan presensi belum tersedia atau telah ditutup oleh panitia.";
  }

  infoPenutupan.innerText =
    "Daftar hadir akan ditutup 60 menit setelah acara di Zoom Workplace berakhir.";
  infoPenutupan.style.display = "block";
}

/*
=====================================================
FORMAT TANGGAL DAN WAKTU
=====================================================
*/

function formatTanggal(tanggal) {
  if (!tanggal) {
    return "-";
  }

  const text = String(tanggal).trim();

  const match = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

  if (match) {
    const day = match[1].padStart(2, "0");
    const month = match[2].padStart(2, "0");
    const year = match[3];

    return `${day}/${month}/${year}`;
  }

  return text;
}

function formatWaktu(waktu) {
  if (!waktu) {
    return "";
  }

  const text = String(waktu).trim();

  const match = text.match(
    /^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/i
  );

  if (!match) {
    return text;
  }

  let hour = Number(match[1]);
  const minute = match[2];
  const period = match[3].toUpperCase();

  if (period === "AM") {
    if (hour === 12) {
      hour = 0;
    }
  } else if (hour !== 12) {
    hour += 12;
  }

  return `${String(hour).padStart(2, "0")}.${minute}`;
}

function formatRentangWaktu(waktuMulai, waktuSelesai) {
  const mulai = formatWaktu(waktuMulai);
  const selesai = formatWaktu(waktuSelesai);

  if (mulai && selesai) {
    return `${mulai} – ${selesai} WIB`;
  }

  if (mulai) {
    return `${mulai} WIB`;
  }

  if (selesai) {
    return `${selesai} WIB`;
  }

  return "-";
}

function getOrCreatePresensiPenutupanInfo(button) {
  let element = document.getElementById("presensi-penutupan-info");

  if (element) {
    return element;
  }

  element = document.createElement("div");
  element.id = "presensi-penutupan-info";
  element.className = "presensi-penutupan-info";

  element.style.marginTop = "12px";
  element.style.fontSize = "14px";
  element.style.lineHeight = "1.5";
  element.style.textAlign = "center";
  element.style.color = "#6b7280";

  button.insertAdjacentElement("afterend", element);

  return element;
}

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

function getStatusKegiatan(tanggal, waktuMulai, waktuSelesai) {
  if (!tanggal) {
    return {
      text: "-",
      className: "status-finished",
    };
  }

  const eventDate = parseTanggalIndonesia(tanggal);
  const now = new Date();

  eventDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (eventDate < today) {
    return {
      text: "Selesai",
      className: "status-finished",
    };
  }

  if (eventDate > today) {
    return {
      text: "Akan Datang",
      className: "status-coming",
    };
  }

  if (!waktuMulai || !waktuSelesai) {
    return {
      text: "Hari ini",
      className: "status-today",
    };
  }

  const waktuMulaiDate = buatTanggalDenganWaktu(eventDate, waktuMulai);
  const waktuSelesaiDate = buatTanggalDenganWaktu(eventDate, waktuSelesai);

  if (now < waktuMulaiDate) {
    return {
      text: "Akan Datang",
      className: "status-coming",
    };
  }

  if (now >= waktuSelesaiDate) {
    return {
      text: "Selesai",
      className: "status-finished",
    };
  }

  return {
    text: "Sedang Berlangsung",
    className: "status-today",
  };
}

/*
=====================================================
AKTIF / NONAKTIF LINK
=====================================================
*/

function setLink(id, url) {
  const element = document.getElementById(id);

  if (!element) {
    return;
  }

  if (url && url.trim() !== "") {
    element.href = url;

    element.classList.remove("disabled");

    element.removeAttribute("aria-disabled");
  } else {
    element.removeAttribute("href");

    element.classList.add("disabled");

    element.setAttribute("aria-disabled", "true");
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

  const text = link.toString().trim();

  /*
    https://drive.google.com/file/d/FILE_ID/view
    */

  const match1 = text.match(/\/d\/([^/]+)/);

  /*
    https://drive.google.com/open?id=FILE_ID
    */

  const match2 = text.match(/[?&]id=([^&]+)/);

  let id = "";

  if (match1 && match1[1]) {
    id = match1[1];
  } else if (match2 && match2[1]) {
    id = match2[1];
  }

  if (id) {
    return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
  }

  return text;
}

/*
=====================================================
GOOGLE DRIVE DOWNLOAD
=====================================================
*/

function ubahKeDownload(link) {
  if (!link) {
    return "";
  }

  const text = link.toString().trim();

  const match1 = text.match(/\/d\/([^/]+)/);

  const match2 = text.match(/[?&]id=([^&]+)/);

  let id = "";

  if (match1 && match1[1]) {
    id = match1[1];
  } else if (match2 && match2[1]) {
    id = match2[1];
  }

  if (id) {
    return `https://drive.google.com/uc?export=download&id=${id}`;
  }

  return text;
}

/*
=====================================================
PENCARIAN SERTIFIKAT
=====================================================
*/

async function cari() {
  const keyword = document.getElementById("keyword").value.trim();

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

      dataKegiatan.kode,
    );

    tampilkan(data);
  } catch (err) {
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
    "#16A34A",
  ];

  let hash = 0;

  const text = (namaKegiatan || "").toString();

  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }

  return warnaList[Math.abs(hash) % warnaList.length];
}

/*
=====================================================
TAMPILKAN HASIL
=====================================================
*/

function tampilkan(data) {
  const hasil = document.getElementById("hasil");

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

  data.forEach((item) => {
    let tombol = "";

    if (item.sertifikat && item.sertifikat.toString().trim() !== "") {
      const downloadLink = ubahKeDownload(item.sertifikat);

      tombol = `

    <a
        class="btn-download"
        href="${item.sertifikat}"
        target="_blank">

        Lihat Sertifikat

    </a>

    <a
        class="btn-download btn-download-secondary"
        href="${downloadLink}">

        Unduh Sertifikat

    </a>

`;
    } else {
      tombol = `

                <span class="status-proses">

                    Masih Diproses

                </span>

            `;
    }

    const warna = warnaKegiatan(item.kegiatan);

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
