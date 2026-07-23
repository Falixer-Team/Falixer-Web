<!-- 基于默认布局，专用于落地页 -->

<template>
  <NuxtLoadingIndicator color="#5B5BD6" :height="2" />
  <div class="flex min-h-screen flex-col">
    <UiNavigation />
    <slot />
    <UiFooterContainer />
  </div>
</template>

<script setup lang="ts">
defineOgImageComponent('Large')

useSeoMeta({
  ogTitle: 'Falixer',
  ogDescription: '业界领先的 Pterodactyl 面板模组平台',
})
</script>

<style scoped>
.nuxt-loading-indicator {
  top: var(--nav-offset) !important;
}
</style>
