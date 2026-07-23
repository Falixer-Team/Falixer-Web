<template>
  <NuxtLoadingIndicator color="#52A9FF" :height="1" />
  <div class="fixed w-full">
    <div class="max-w-200 container px-0 md:px-4">
      <div
        class="flex items-center justify-between gap-1.5 border-b border-t-0 border-neutral-700 bg-neutral-950 p-3 md:border-x"
      >
        <BrandWordmark />
        <div>
          <NuxtLink href="/blog" tabindex="-1">
            <ElementsButtonSmall>帖子</ElementsButtonSmall>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>

  <div class="max-w-200 container px-0 md:px-4">
    <div class="bg-neutral-950">
      <div
        class="pt-(--nav-offset) bg-stripes min-h-screen border-neutral-700 bg-neutral-950 md:border-x"
      >
        <div class="bg-neutral-950">
          <slot />
        </div>
        <div class="h-5" />
      </div>
      <div
        class="border-b-0 border-t border-neutral-700 bg-[url(/img/blurredhome2.jpeg)] bg-cover bg-center md:border-x"
      >
        <div
          class="bg-linear-to-b md:bg-linear-to-r h-full w-full from-neutral-950 via-neutral-950 to-neutral-950/25 p-6"
        >
          <div class="flex flex-col gap-5 md:flex-row md:items-center md:gap-0">
            <div class="space-y-2 md:w-3/5">
              <div class="flex h-full items-center gap-2">
                <Icon name="pixelarticons:heart" mode="svg" :size="24" />
                <h2>赞助商</h2>
              </div>
              <p>
                支持我们保持游戏托管社区开放与公平的使命。
                <NuxtLink to="https://bpfw.io/donate" class="text-link">
                  向 Falixer 捐赠
                </NuxtLink>
              </p>
            </div>
            <div class="flex md:w-2/5 md:justify-end">
              <div class="space-y-2">
                <p class="text-default-font/70 text-justify font-bold">
                  赞助支持
                </p>
                <NuxtLink
                  to="https://ultraservers.com"
                  target="_blank"
                  class="hover:text-brand-50 focus:text-brand-50 focus:outline-brand-50 flex items-center rounded-sm outline-1 outline-offset-8 outline-transparent transition-colors first:gap-2"
                  @mousedown.prevent
                >
                  <SvgUltraservers size="32" />
                  <span class="h2 text-[1.6rem]">UltraServers</span>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="border-b-0 border-t border-neutral-700 bg-neutral-950 p-4 md:border-x"
      >
        <div class="flex flex-col items-center">
          <div class="flex items-center gap-1">
            <Icon name="memory:alpha-c" />
            <span>
              <span>2023-2026 Emma（</span>
              <NuxtLink
                to="https://prpl.wtf"
                class="hover:text-brand-50 default underline transition-colors"
                >prpl.wtf</NuxtLink
              >
              <span>）及贡献者</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    class="bg-size-[30px_30px] fixed inset-0 left-0 top-0 -z-10 h-full w-full bg-[linear-gradient(to_right,var(--color-neutral-800)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-neutral-800)_1px,transparent_1px)]"
  >
    <div
      class="bg-linear-to-r hidden h-full w-full from-transparent via-neutral-950 to-transparent lg:block"
    />
    <div class="h-full w-full bg-neutral-950 lg:hidden" />
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Falixer 博客',
  description: '来自业界领先的 Pterodactyl 模组平台的文章',
  ogType: 'article',
  ogTitle: 'Falixer 博客',
  ogDescription: '来自业界领先的 Pterodactyl 模组平台的文章',
})

defineOgImageComponent('Large')
</script>

<style>
.nuxt-loading-indicator {
  top: 0px !important;
}

:root {
  --nav-offset: 53px;
}
</style>
