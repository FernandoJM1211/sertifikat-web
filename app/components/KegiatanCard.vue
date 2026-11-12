<script setup lang="ts">
import type { KegiatanRingkas } from "#shared/types";

defineProps<{
  item: KegiatanRingkas;
  status: StatusKegiatan;
}>();
</script>

<template>
  <!--
    Sengaja memakai <a> biasa (bukan <NuxtLink>): halaman detail memakai
    stylesheet berbeda, sehingga perpindahan halaman dilakukan dengan reload penuh.
  -->
  <a
    :href="`/kegiatan/${encodeURIComponent(item.kode)}`"
    class="kegiatan-card fade-in"
  >
    <div class="card-image">
      <img
        :src="driveThumbnail(item.flyer)"
        :alt="item.nama"
        loading="lazy"
        decoding="async"
        draggable="false"
      />
    </div>

    <div class="card-content">
      <div class="card-meta">
        <div class="card-date">📅 {{ item.tanggal }}</div>

        <div class="card-status" :class="status.className">
          {{ status.text }}
        </div>
      </div>

      <h3>{{ item.nama }}</h3>
    </div>
  </a>
</template>
