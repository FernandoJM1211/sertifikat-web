<script setup lang="ts">
// Vercel Web Analytics
useHead({
  link: [{ rel: "stylesheet", href: "/css/skm-popup.css" }],
  script: [
    {
      innerHTML:
        "window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };",
    },
    { src: "/_vercel/insights/script.js", defer: true },
  ],
});
</script>

<template>
  <NuxtPage />
  <SkmPopup />
</template>
