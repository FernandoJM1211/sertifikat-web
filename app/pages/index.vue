<script setup lang="ts">
import type { ApiResponse, KegiatanRingkas } from "#shared/types";

const PER_PAGE = 6;

useHead({
  title: "Portal Kegiatan Direktorat Teknologi dan Digitalisasi Pembelajaran",
  link: [{ rel: "stylesheet", href: "/css/home.css" }],
});

/*
=========================================
DATA KEGIATAN
=========================================
*/

// Data diambil di browser (bukan saat render server) agar halaman langsung
// tampil dengan skeleton selama data kegiatan dimuat.
const { data, status, error } = useFetch<ApiResponse<KegiatanRingkas[]>>(
  "/api/kegiatan-list",
  { server: false, lazy: true },
);

const loading = computed(
  () => status.value === "idle" || status.value === "pending",
);

const pesanError = computed(() => {
  if (error.value) {
    return (
      (error.value.data as ApiResponse<unknown> | undefined)?.message ||
      "Gagal mengambil data kegiatan."
    );
  }
  if (data.value && !data.value.success) return data.value.message;
  return "";
});

const kegiatan = computed(() =>
  (data.value?.data || []).map((item) => ({
    item,
    status: getStatusKegiatan(item.tanggal, item.waktu, item.waktuSelesai),
  })),
);

const skeletonCount = ref(3);

onMounted(() => {
  if (window.innerWidth <= 768) skeletonCount.value = 2;
});

/*
=========================================
PENCARIAN DAN PAGINATION
=========================================
*/

const keyword = ref("");
const currentPage = ref(1);

const hasilFilter = computed(() => {
  const kata = keyword.value.trim().toLocaleLowerCase("id-ID");
  if (!kata) return kegiatan.value;

  return kegiatan.value.filter(({ item, status }) =>
    `${item.tanggal} ${status.text} ${item.nama}`
      .toLocaleLowerCase("id-ID")
      .includes(kata),
  );
});

const totalPages = computed(() => Math.ceil(hasilFilter.value.length / PER_PAGE));

const kartuHalamanIni = computed(() => {
  const start = (currentPage.value - 1) * PER_PAGE;
  return hasilFilter.value.slice(start, start + PER_PAGE);
});

watch(keyword, () => (currentPage.value = 1));

function gantiHalaman(page: number) {
  if (page < 1 || page > totalPages.value) return;

  currentPage.value = page;

  document
    .querySelector(".section-header")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}
</script>

<template>
  <header class="page-header">
    <div class="header-overlay">
      <div class="header-content">
        <div class="header-logo">
          <img :src="LOGO_URL" alt="Logo LAN" />
        </div>

        <div class="header-title">
          <h1>Direktorat Teknologi dan Digitalisasi Pembelajaran</h1>
          <p>Lembaga Administrasi Negara</p>
        </div>
      </div>

      <section class="hero">
        <h2>Portal Kegiatan</h2>

        <p>
          Temukan seluruh kegiatan yang diselenggarakan oleh Direktorat
          Teknologi dan Digitalisasi Pembelajaran. Mulai dari informasi
          kegiatan, presensi, live streaming, file pendukung, hingga pencarian
          sertifikat.
        </p>
      </section>
    </div>
  </header>

  <main class="container">
    <section class="section-header">
      <h2>Daftar Kegiatan</h2>
      <p>Pilih salah satu kegiatan di bawah ini.</p>
    </section>

    <!-- Pencarian Kegiatan -->
    <div class="kegiatan-search">
      <span class="kegiatan-search-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <circle cx="10.8" cy="10.8" r="6.5"></circle>
          <path d="m16 16 4.2 4.2"></path>
        </svg>
      </span>

      <input
        id="kegiatan-search-input"
        v-model="keyword"
        type="search"
        placeholder="Cari nama kegiatan..."
        aria-label="Cari nama kegiatan"
        autocomplete="off"
      />
    </div>

    <section id="kegiatan-container" class="kegiatan-container">
      <!-- Skeleton -->
      <div v-if="loading" id="kegiatan-skeleton" class="kegiatan-grid">
        <div v-for="i in skeletonCount" :key="i" class="skeleton-card">
          <div class="skeleton-image"></div>

          <div class="skeleton-content">
            <div class="skeleton-line short"></div>
            <div class="skeleton-line long"></div>
            <div class="skeleton-line medium"></div>
          </div>
        </div>
      </div>

      <!-- Error -->
      <div
        v-else-if="pesanError"
        id="kegiatan-grid"
        class="kegiatan-grid"
        style="display: block"
      >
        <div class="error">{{ pesanError }}</div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!kegiatan.length" id="empty-state" class="empty-state fade-in">
        <div class="empty-icon">📅</div>

        <h3>Belum Ada Kegiatan Aktif</h3>

        <p>
          Saat ini belum terdapat kegiatan yang sedang dibuka. Silakan kunjungi
          kembali beberapa waktu lagi.
        </p>
      </div>

      <template v-else>
        <!-- Grid -->
        <div id="kegiatan-grid" class="kegiatan-grid fade-in">
          <KegiatanCard
            v-for="kartu in kartuHalamanIni"
            :key="kartu.item.kode"
            :item="kartu.item"
            :status="kartu.status"
          />
        </div>

        <div v-if="!hasilFilter.length" class="kegiatan-search-empty">
          Kegiatan tidak ditemukan. Coba kata kunci lain.
        </div>

        <!-- Pagination -->
        <nav
          id="kegiatan-pagination"
          class="kegiatan-pagination"
          aria-label="Navigasi halaman kegiatan"
        >
          <template v-if="totalPages > 1">
            <button
              type="button"
              :disabled="currentPage === 1"
              @click="gantiHalaman(currentPage - 1)"
            >
              Sebelumnya
            </button>

            <button
              v-for="page in totalPages"
              :key="page"
              type="button"
              :class="{ active: page === currentPage }"
              :aria-current="page === currentPage ? 'page' : undefined"
              @click="gantiHalaman(page)"
            >
              {{ page }}
            </button>

            <button
              type="button"
              :disabled="currentPage === totalPages"
              @click="gantiHalaman(currentPage + 1)"
            >
              Selanjutnya
            </button>
          </template>
        </nav>
      </template>
    </section>
  </main>
</template>
