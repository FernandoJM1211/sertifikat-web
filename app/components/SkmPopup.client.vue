<script setup lang="ts">
/*
  Popup Survei Kepuasan Masyarakat (SKM).
  Muncul 15 detik setelah halaman dibuka, tertutup otomatis setelah 30 detik,
  dan tidak muncul lagi selama 24 jam setelah tombol survei diklik.
*/
const POPUP_DELAY = 15 * 1000;
const POPUP_DURATION_DETIK = 30;
const REMINDER_INTERVAL = 24 * 60 * 60 * 1000;
const SKM_URL =
  "https://skm.go.id/share/instansi/09844566-8b51-40be-95c9-85912bffd732/2";
const STORAGE_KEY = "skm_popup_last_clicked";

const ada = ref(false);
const tampil = ref(false);
const sisa = ref(POPUP_DURATION_DETIK);

let showTimer: ReturnType<typeof setTimeout> | undefined;
let closeTimer: ReturnType<typeof setTimeout> | undefined;
let removeTimer: ReturnType<typeof setTimeout> | undefined;
let countdownTimer: ReturnType<typeof setInterval> | undefined;

function sudahKlikDalam24Jam() {
  try {
    const lastClicked = Number(localStorage.getItem(STORAGE_KEY));
    return (
      !!lastClicked &&
      !Number.isNaN(lastClicked) &&
      Date.now() - lastClicked < REMINDER_INTERVAL
    );
  } catch {
    return false;
  }
}

function bersihkanTimer() {
  clearTimeout(showTimer);
  clearTimeout(closeTimer);
  clearInterval(countdownTimer);
}

async function tampilkanPopup() {
  if (sudahKlikDalam24Jam()) return;

  ada.value = true;
  await nextTick();
  tampil.value = true;

  sisa.value = POPUP_DURATION_DETIK;
  countdownTimer = setInterval(() => {
    sisa.value -= 1;
    if (sisa.value <= 1) clearInterval(countdownTimer);
  }, 1000);

  closeTimer = setTimeout(tutupPopup, POPUP_DURATION_DETIK * 1000);
}

function tutupPopup() {
  bersihkanTimer();
  tampil.value = false;
  removeTimer = setTimeout(() => (ada.value = false), 250);
}

function klikSurvei() {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    // Penyimpanan diblokir browser: popup tetap ditutup.
  }
  tutupPopup();
}

onMounted(() => {
  if (sudahKlikDalam24Jam()) return;
  showTimer = setTimeout(tampilkanPopup, POPUP_DELAY);
});

onBeforeUnmount(() => {
  bersihkanTimer();
  clearTimeout(removeTimer);
});
</script>

<template>
  <div
    v-if="ada"
    id="skm-popup"
    class="skm-popup"
    :class="{ show: tampil }"
    role="dialog"
    aria-modal="true"
    aria-labelledby="skm-popup-title"
  >
    <div class="skm-popup-card">
      <button
        type="button"
        class="skm-popup-close"
        aria-label="Tutup"
        @click="tutupPopup"
      >
        &times;
      </button>

      <div class="skm-popup-icon" aria-hidden="true">📋</div>

      <h2 id="skm-popup-title" class="skm-popup-title">
        Bantu Kami Meningkatkan Kualitas Layanan
      </h2>

      <p class="skm-popup-text">
        Mohon kesediaan Anda untuk mengisi Survei Kepuasan Masyarakat (SKM)
        sebagai bahan evaluasi dan peningkatan kualitas layanan Direktorat
        Teknologi dan Digitalisasi Pembelajaran.
      </p>

      <a
        :href="SKM_URL"
        target="_blank"
        rel="noopener noreferrer"
        class="skm-popup-button"
        @click="klikSurvei"
      >
        Isi Survei SKM
      </a>

      <div class="skm-popup-timer">
        Popup akan tertutup otomatis dalam {{ sisa }} detik.
      </div>
    </div>
  </div>
</template>
