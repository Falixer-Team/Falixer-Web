<template>
  <div
    :class="props?.class"
    class="grid grid-cols-1 overflow-hidden rounded-3xl border border-neutral-700 bg-neutral-950 lg:grid-cols-2 lg:grid-rows-2"
  >
    <div class="grid grid-rows-2">
      <div
        class="grid h-full border-b border-neutral-700 p-8 lg:border-e lg:p-16"
      >
        <div class="space-y-3 self-center">
          <Icon name="memory:anvil" mode="svg" :size="48" />
          <h1>面向 Pterodactyl® 插件的坚实平台</h1>
          <span class="opacity-75">
            Pterodactyl 的修改、附加组件和主题长期以来都饱受折磨。 Falixer
            带来改变，让 Pterodactyl 及其模组生态迈向新高度。
          </span>
        </div>
      </div>
      <div
        class="grid h-full border-b border-neutral-700 p-8 lg:border-e lg:p-16"
      >
        <div class="space-y-3 self-center">
          <Icon name="memory:account-box" mode="svg" :size="48" />
          <h1>商业维护与持续交付</h1>
          <span class="opacity-75">
            Falixer 是闭源付费产品，由专业团队持续开发和维护。
            有效商业授权用于获得产品使用权及对应的更新与服务。
          </span>
        </div>
      </div>
    </div>
    <div class="border-b border-neutral-700">
      <NuxtImg
        src="/img/pterodactyl.jpeg"
        :width="1280"
        :height="1024"
        class="aspect-video h-full w-full object-cover"
      />
    </div>
    <div class="lg:order-0 order-last border-neutral-700 lg:border-e">
      <video
        width="1280"
        height="1024"
        autoplay
        muted
        loop
        class="h-full w-full object-cover"
        playsinline
        webkit-playsinline
        preload="none"
        tabindex="-1"
      >
        <source src="/img/console.mp4" type="video/mp4" />
        <source src="/img/console.webm" type="video/webm" />
      </video>
    </div>
    <div class="grid grid-rows-2">
      <div class="grid h-full border-b border-neutral-700 p-8 lg:p-16">
        <div class="space-y-3 self-center">
          <Icon name="memory:terminal" mode="svg" :size="48" />
          <h1>强大的 CLI 工具</h1>
          <span class="opacity-75">
            在几分钟内安装、移除并更新你的全部扩展。
            让你摆脱调试周末、失眠之夜和不可靠安装脚本的困扰。
          </span>
        </div>
      </div>
      <div
        class="grid h-full border-b border-neutral-700 p-8 lg:border-b-0 lg:p-16"
      >
        <div class="space-y-3 self-center">
          <Icon name="memory:pickaxe" mode="svg" :size="48" />
          <h1>开发者熟悉且喜爱的工具</h1>
          <span class="opacity-75">
            我们持续构建工具来改善你的开发体验。 使用 Falixer，制作 Pterodactyl
            附加组件和主题会更轻松。
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  class: {
    type: String,
    required: false,
  },
})
</script>
