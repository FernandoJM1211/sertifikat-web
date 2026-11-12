<script setup lang="ts">
import type { ApiResponse, Kegiatan, Sertifikat } from "#shared/types";

type Tab = "info" | "sertifikat" | "presensi" | "siaran" | "files";

const route = useRoute();
const kode = String(route.params.kode);

useHead({
  link: [{ rel: "stylesheet", href: "/css/kegiatan.css" }],
});

/*
=====================================================
DATA KEGIATAN
Diambil di browser agar halaman langsung tampil dengan skeleton.
=====================================================
*/

const { data: response, status: statusFetch } = useFetch<
  ApiResponse<Kegiatan>
>("/api/kegiatan-detail", {
  query: { kode },
  server: false,
  lazy: true,
});

const kegiatan = computed(() => response.value?.data);

const loading = computed(
  () => statusFetch.value === "idle" || statusFetch.value === "pending",
);

useHead({
  title: () => kegiatan.value?.nama || "Portal Kegiatan DTDP",
});

// Kegiatan tidak ditemukan / gagal dimuat: kembali ke beranda.
watch(statusFetch, (s) => {
  if ((s === "success" || s === "error") && !kegiatan.value) {
    alert("Data kegiatan tidak ditemukan.");
    window.location.href = "/";
  }
});

const status = computed(() =>
  kegiatan.value
    ? getStatusKegiatan(
        kegiatan.value.tanggal,
        kegiatan.value.waktu,
        kegiatan.value.waktuSelesai,
      )
    : null,
);

const presensiTersedia = computed(() => !!safeUrl(kegiatan.value?.presensi));

/*
=====================================================
GAMBAR
Skeleton tampil sampai gambar selesai dimuat;
jika gagal, gambar diganti logo LAN.
=====================================================
*/

function useGambar(link: () => string | undefined) {
  const src = ref(LOGO_URL);
  const termuat = ref(false);

  watch(
    link,
    (url) => {
      src.value = driveThumbnail(url) || LOGO_URL;
      termuat.value = false;
    },
    { immediate: true },
  );

  function onLoad() {
    termuat.value = true;
  }

  function onError() {
    if (src.value === LOGO_URL) {
      termuat.value = true;
      return;
    }
    src.value = LOGO_URL;
  }

  return reactive({ src, termuat, onLoad, onError });
}

const flyer = useGambar(() => kegiatan.value?.flyer);
const vb = useGambar(() => kegiatan.value?.virtualBackground);

/*
=====================================================
SIDEBAR & TAB
=====================================================
*/

const sidebarTertutup = ref(false);
const tabAktif = ref<Tab>("info");

const menu: { id: Tab; icon: string; label: string }[] = [
  { id: "info", icon: "ℹ️", label: "Informasi Kegiatan" },
  { id: "sertifikat", icon: "📄", label: "Sertifikat" },
  { id: "presensi", icon: "📝", label: "Presensi" },
  { id: "siaran", icon: "📡", label: "Akses Streaming" },
  { id: "files", icon: "📁", label: "Files" },
];

/*
=====================================================
PENCARIAN SERTIFIKAT
=====================================================
*/

type HasilPencarian =
  | { state: "idle" }
  | { state: "kosong-keyword" }
  | { state: "terlalu-pendek" }
  | { state: "loading" }
  | { state: "error" }
  | { state: "hasil"; data: Sertifikat[] };

const keyword = ref("");
const hasil = ref<HasilPencarian>({ state: "idle" });

async function cari() {
  const kata = keyword.value.trim();

  if (kata === "") {
    hasil.value = { state: "kosong-keyword" };
    return;
  }

  if (kata.length < KEYWORD_MIN) {
    hasil.value = { state: "terlalu-pendek" };
    return;
  }

  if (!kegiatan.value) return;

  hasil.value = { state: "loading" };

  try {
    const result = await $fetch<ApiResponse<Sertifikat[]>>("/api/sertifikat", {
      query: { keyword: kata, kode: kegiatan.value.kode },
    });

    hasil.value = {
      state: "hasil",
      data: result.success ? result.data || [] : [],
    };
  } catch (err) {
    console.error(err);
    hasil.value = { state: "error" };
  }
}

/** Warna badge kegiatan yang konsisten berdasarkan nama kegiatan. */
function warnaKegiatan(namaKegiatan: string) {
  const warnaList = [
    "#2563EB", "#059669", "#D97706", "#DC2626", "#7C3AED",
    "#0891B2", "#DB2777", "#4F46E5", "#0EA5E9", "#16A34A",
  ];

  let hash = 0;
  const text = String(namaKegiatan || "");

  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }

  return warnaList[Math.abs(hash) % warnaList.length];
}
</script>

<template>
  <div class="app">
    <!-- ===========================
         SIDEBAR
    =========================== -->
    <aside id="sidebar" class="sidebar" :class="{ closed: sidebarTertutup }">
      <button class="toggle-sidebar" @click="sidebarTertutup = !sidebarTertutup">
        ☰
      </button>

      <div class="nav">
        <button
          v-for="m in menu"
          :id="`btn-${m.id}`"
          :key="m.id"
          class="nav-button"
          :class="{ active: tabAktif === m.id }"
          @click="tabAktif = m.id"
        >
          {{ m.icon }}
          <span>{{ m.label }}</span>
        </button>

        <div class="nav-spacer"></div>

        <a href="/" class="nav-button nav-back">
          ⬅️
          <span>Kembali</span>
        </a>
      </div>
    </aside>

    <!-- ===========================
         MAIN
    =========================== -->
    <main class="main">
      <div class="content-header">
        <div class="logo-container">
          <img :src="LOGO_URL" alt="Logo LAN" decoding="async" />
        </div>

        <div class="header-title">
          <h1>Direktorat Teknologi dan Digitalisasi Pembelajaran</h1>
          <p>Lembaga Administrasi Negara</p>
        </div>
      </div>

      <div class="page">
        <!-- ==========================================
             TAB INFORMASI
        ========================================== -->
        <section id="tab-info" class="tab-content" :class="{ active: tabAktif === 'info' }">
          <div class="info-layout">
            <div class="flyer-card">
              <div v-if="!flyer.termuat" class="skeleton-block skeleton-flyer"></div>

              <img
                v-if="kegiatan"
                id="info-flyer"
                :class="{ 'img-loading': !flyer.termuat }"
                :src="flyer.src"
                alt="Flyer Kegiatan"
                decoding="async"
                @load="flyer.onLoad"
                @error="flyer.onError"
              />
            </div>

            <div class="info-side">
              <!-- Skeleton -->
              <div v-if="!kegiatan" class="info-side-card" aria-hidden="true">
                <div class="skeleton-line title long"></div>
                <div class="skeleton-line title medium"></div>

                <div class="info-item">
                  <div class="skeleton-line short"></div>
                  <div class="skeleton-line medium"></div>
                </div>

                <div class="info-item">
                  <div class="skeleton-line short"></div>
                  <div class="skeleton-line medium"></div>
                </div>
              </div>

              <div v-else class="info-side-card">
                <h2 id="info-nama">{{ kegiatan.nama || "-" }}</h2>

                <div class="info-item">
                  <div class="info-header">
                    <div class="info-label">Tanggal</div>

                    <div id="info-status" class="status-badge" :class="status?.className">
                      {{ status?.text }}
                    </div>
                  </div>

                  <div id="info-tanggal" class="info-value">
                    {{ formatTanggal(kegiatan.tanggal) }}
                  </div>
                </div>

                <div class="info-item">
                  <div class="info-label">Waktu</div>

                  <div id="info-waktu" class="info-value">
                    {{ formatRentangWaktu(kegiatan.waktu, kegiatan.waktuSelesai) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="desc-card">
            <h3>Deskripsi Kegiatan</h3>

            <div v-if="!kegiatan" aria-hidden="true">
              <div class="skeleton-line long"></div>
              <div class="skeleton-line long"></div>
              <div class="skeleton-line medium"></div>
            </div>

            <p v-else id="info-deskripsi">{{ kegiatan.deskripsi || "-" }}</p>
          </div>

          <HotlineCard />
        </section>

        <!-- ==========================================
             TAB SERTIFIKAT
        ========================================== -->
        <section
          id="tab-sertifikat"
          class="tab-content"
          :class="{ active: tabAktif === 'sertifikat' }"
        >
          <div class="search-card">
            <div class="icon-circle">📄</div>

            <h2>Pencarian Sertifikat Kegiatan</h2>

            <p class="notice">
              <strong>
                SERTIFIKAT TERSEDIA MINIMAL H+7 HARI KERJA SETELAH PELAKSANAAN
                WEBINAR.
              </strong>
            </p>

            <p class="description">
              Masukkan nama peserta untuk mencari sertifikat kegiatan. Pastikan
              nama sesuai dengan data pendaftaran.
            </p>

            <div class="search-row">
              <input
                id="keyword"
                v-model="keyword"
                placeholder="Masukkan nama peserta"
                :maxlength="KEYWORD_MAX"
              />
              <button :disabled="loading" @click="cari">Cari Sertifikat</button>
            </div>
          </div>

          <div id="hasil">
            <div v-if="hasil.state === 'kosong-keyword'" class="empty-state">
              Silakan masukkan nama peserta terlebih dahulu.
            </div>

            <div v-else-if="hasil.state === 'terlalu-pendek'" class="empty-state">
              Masukkan minimal {{ KEYWORD_MIN }} huruf nama peserta.
            </div>

            <div v-else-if="hasil.state === 'loading'" class="loading-search">
              <div class="spinner"></div>
              <p>Sedang mencari sertifikat...</p>
            </div>

            <div v-else-if="hasil.state === 'error'" class="empty-state">
              Terjadi kesalahan saat mencari data.
            </div>

            <template v-else-if="hasil.state === 'hasil'">
              <div v-if="!hasil.data.length" class="empty-state">
                Data tidak ditemukan. Pastikan nama yang dimasukkan sudah sesuai.
              </div>

              <template v-else>
                <div class="hasil-info">
                  📌 Hasil Pencarian - Ditemukan {{ hasil.data.length }} data
                </div>

                <div v-for="(item, i) in hasil.data" :key="i" class="result-card">
                  <div class="result-data">
                    <div class="label">Nama</div>
                    <div class="value"><strong>{{ item.nama }}</strong></div>

                    <div class="label">Instansi</div>
                    <div class="value">{{ item.instansi || "-" }}</div>

                    <div class="label">Kegiatan</div>
                    <div class="value">
                      <span class="event-badge" :style="{ color: warnaKegiatan(item.kegiatan) }">
                        {{ item.kegiatan }}
                      </span>
                    </div>
                  </div>

                  <div class="action">
                    <template v-if="safeUrl(item.sertifikat)">
                      <a
                        class="btn-download"
                        :href="safeUrl(item.sertifikat)"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Lihat Sertifikat
                      </a>

                      <a
                        class="btn-download btn-download-secondary"
                        :href="driveDownload(item.sertifikat)"
                        rel="noopener noreferrer"
                      >
                        Unduh Sertifikat
                      </a>
                    </template>

                    <span v-else class="status-proses">Masih Diproses</span>
                  </div>
                </div>
              </template>
            </template>
          </div>

          <div class="footer-note">
            Pastikan nama yang dimasukkan sesuai dengan data pendaftaran. Jika
            sertifikat belum tersedia, silakan cek kembali secara berkala atau
            hubungi panitia.
          </div>

          <HotlineCard singkat />
        </section>

        <!-- ==========================================
             TAB PRESENSI
        ========================================== -->
        <section
          id="tab-presensi"
          class="tab-content"
          :class="{ active: tabAktif === 'presensi' }"
        >
          <div class="search-card">
            <div class="icon-circle">📝</div>

            <h2>Presensi Kegiatan</h2>

            <!-- Skeleton -->
            <div v-if="!kegiatan" aria-hidden="true">
              <div class="skeleton-line medium center"></div>
              <div class="skeleton-block skeleton-button narrow"></div>
            </div>

            <template v-else>
              <p id="presensi-info">
                <template v-if="presensiTersedia">
                  Silakan mengisi daftar hadir kegiatan melalui tautan presensi berikut.
                </template>
                <template v-else>
                  Tautan presensi belum tersedia atau telah ditutup oleh panitia.
                </template>
              </p>

              <a
                id="link-presensi"
                v-bind="linkAttrs(kegiatan.presensi)"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-presensi"
                :class="{ 'btn-presensi-disabled': !presensiTersedia }"
              >
                {{ presensiTersedia ? "Isi Presensi" : "Presensi Ditutup" }}
              </a>
            </template>

            <div
              id="presensi-penutupan-info"
              class="presensi-penutupan-info"
              style="
                display: block;
                margin-top: 12px;
                font-size: 14px;
                line-height: 1.5;
                text-align: center;
                color: #6b7280;
              "
            >
              Daftar hadir akan ditutup 60 menit setelah acara di Zoom Workplace
              berakhir.
            </div>
          </div>

          <div class="footer-note">
            Pastikan data presensi diisi dengan benar karena akan digunakan untuk
            kebutuhan administrasi kegiatan.
          </div>

          <HotlineCard />
        </section>

        <!-- ==========================================
             TAB FILES
        ========================================== -->
        <section id="tab-files" class="tab-content" :class="{ active: tabAktif === 'files' }">
          <div class="files-grid">
            <div class="file-card">
              <h2>🖼️ Virtual Background</h2>

              <div v-if="!vb.termuat" class="skeleton-block skeleton-vb"></div>

              <img
                v-if="kegiatan"
                id="vb-preview"
                class="vb-preview"
                :class="{ 'img-loading': !vb.termuat }"
                :src="vb.src"
                alt="Virtual Background"
                decoding="async"
                @load="vb.onLoad"
                @error="vb.onError"
              />

              <div v-if="!kegiatan" class="skeleton-block skeleton-button"></div>

              <a
                v-else
                id="btn-vb"
                v-bind="linkAttrs(kegiatan.virtualBackground)"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-file"
              >
                Simpan Gambar
              </a>
            </div>

            <div class="file-card">
              <div class="file-icon">📁</div>

              <h2>File Pendukung</h2>

              <p>
                Akses materi, panduan, maupun file pendukung kegiatan melalui
                Google Drive.
              </p>

              <div v-if="!kegiatan" class="skeleton-block skeleton-button"></div>

              <a
                v-else
                id="link-files"
                v-bind="linkAttrs(kegiatan.files)"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-file"
              >
                Buka Google Drive
              </a>
            </div>
          </div>

          <HotlineCard />
        </section>

        <!-- ==========================================
             TAB SIARAN
        ========================================== -->
        <section id="tab-siaran" class="tab-content" :class="{ active: tabAktif === 'siaran' }">
          <div class="search-card">
            <div class="icon-circle">📡</div>

            <h2>Ruang Siaran</h2>

            <p>
              Silakan pilih platform di bawah ini untuk bergabung ke dalam sesi
              live streaming kegiatan.
            </p>

            <!-- Skeleton -->
            <div v-if="!kegiatan" class="siaran-grid" aria-hidden="true">
              <div class="skeleton-block skeleton-siaran"></div>
              <div class="skeleton-block skeleton-siaran"></div>
            </div>

            <div v-else class="siaran-grid">
              <a
                id="link-zoom"
                v-bind="linkAttrs(kegiatan.zoom)"
                target="_blank"
                rel="noopener noreferrer"
                class="siaran-card"
              >
                <div class="siaran-icon">
                  <img
                    src="https://img.icons8.com/?size=100&id=7csVZvHoQrLW&format=png&color=000000"
                    alt="Zoom"
                  />
                </div>
                <h3>Zoom Meeting</h3>
                <p>Interaksi Langsung</p>
              </a>

              <a
                id="link-youtube"
                v-bind="linkAttrs(kegiatan.youtube)"
                target="_blank"
                rel="noopener noreferrer"
                class="siaran-card"
              >
                <div class="siaran-icon">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png"
                    alt="YouTube"
                  />
                </div>
                <h3>YouTube Live</h3>
                <p>Nonton Saja</p>
              </a>
            </div>
          </div>

          <HotlineCard />
        </section>
      </div>
    </main>
  </div>
</template>
