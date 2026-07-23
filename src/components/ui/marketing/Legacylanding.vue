<template>
  <div class="space-y-8 md:space-y-2 md:py-4">
    <NuxtLink to="/pricing" class="group block outline-0" @mousedown.prevent>
      <div
        class="flex w-full justify-between overflow-hidden rounded-3xl border border-neutral-700 bg-neutral-950 transition-colors group-hover:bg-neutral-900 group-focus:border-neutral-500 group-focus:bg-neutral-900"
      >
        <div class="px-4 py-2">
          <span class="text-brand-50 font-bold"> 获取 Falixer </span>
          <span> 商业授权并安装到你的 Pterodactyl 面板。 </span>
        </div>
        <div
          class="group-hover:text-brand-50 group-focus:text-brand-50 flex items-center gap-1 border-s border-neutral-700 p-2 transition-colors group-focus:border-neutral-500 md:px-4 md:py-2"
        >
          <span class="hidden md:inline"> 立即安装 </span>
          <Icon name="memory:chevron-right" :size="20" />
        </div>
      </div>
    </NuxtLink>

    <span class="md:display h1 block xl:text-justify">
      <span class="text-gray-500">业界领先的</span>
      模组平台
      <span class="text-gray-500">，适用于 Pterodactyl® 面板 </span>
    </span>
  </div>
</template>
