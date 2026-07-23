<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2.5">
      <BrandEmblem class="text-brand-50" />
      <div class="flex items-center gap-1">
        <Icon name="memory:alpha-c" />
        <span>
          <span>2026 </span>
          <NuxtLink
            to="https://falixer.dev"
            class="hover:text-brand-50 default underline transition-colors"
            >Falixer Team</NuxtLink
          >
          <!-- <span>) and contributors</span> -->
        </span>
      </div>
    </div>
    <span class="hidden text-lg lg:inline">
      Pterodactyl 的插件平台
    </span>
  </div>
</template>
