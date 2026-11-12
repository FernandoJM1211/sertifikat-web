<script setup lang="ts">
defineProps<{
  /** Pakai teks pendek (dipakai di tab Sertifikat). */
  singkat?: boolean;
}>();

const WHATSAPP_URL = "https://wa.me/6287782214464";
</script>

<template>
  <div class="hotline-card">
    <h3>📞 Butuh Bantuan?</h3>

    <p v-if="singkat">
      Jika mengalami kendala, silakan hubungi Panitia Direktorat Teknologi dan
      Digitalisasi Pembelajaran.
    </p>

    <p v-else>
      Jika mengalami kendala presensi, akses streaming, file pendukung, maupun
      sertifikat kegiatan, silakan hubungi Panitia Direktorat Teknologi dan
      Digitalisasi Pembelajaran.
    </p>

    <a :href="WHATSAPP_URL" target="_blank" rel="noopener noreferrer" class="btn-wa">
      💬 Hubungi via WhatsApp
    </a>
  </div>
</template>
