<template>
  <section
    class="relative overflow-hidden border-b border-neutral-700 bg-neutral-950"
  >
    <div
      class="bg-linear-to-b from-brand-900/70 pointer-events-none absolute inset-x-0 top-0 h-96 to-transparent"
    ></div>
    <div class="container relative pb-0 pt-20 text-center md:pt-28">
      <NuxtLink
        to="/releases"
        class="text-default-font/65 hover:text-default-font mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-xs shadow-sm transition-colors hover:border-neutral-500"
      >
        <span class="bg-brand-50 size-1.5 rounded-full"></span>
        <span>全新版本现已发布</span>
        <Icon name="lucide:arrow-right" :size="13" />
      </NuxtLink>

      <h1
        class="mx-auto max-w-4xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] md:text-7xl"
      >
        扩展 Pterodactyl，
        <span class="text-default-font/35">不再修改核心文件</span>
      </h1>
      <p
        class="text-default-font/60 mx-auto mt-7 max-w-2xl text-base leading-7 md:text-lg md:leading-8"
      >
        从发现、安装到更新，用一套清晰可靠的工作流管理你的全部扩展。为面板管理员和开发者共同打造。
      </p>
      <div
        class="text-default-font/60 mx-auto mt-5 flex w-fit items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs"
      >
        <Icon name="lucide:lock-keyhole" :size="13" />
        <span>商业闭源框架 · 使用需购买授权</span>
      </div>

      <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
        <NuxtLink
          to="/pricing"
          class="flex items-center gap-2 rounded-full bg-neutral-50 px-5 py-2.5 text-sm font-semibold text-neutral-950 shadow-md transition-transform hover:-translate-y-0.5"
        >
          查看授权价格
          <Icon name="lucide:arrow-up-right" :size="16" />
        </NuxtLink>
        <NuxtLink
          to="/browse"
          class="flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-950 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-neutral-900"
        >
          浏览扩展
        </NuxtLink>
      </div>

      <div class="relative mx-auto mt-16 max-w-5xl md:mt-20">
        <div
          class="bg-brand-50/10 absolute inset-x-16 -top-10 h-36 rounded-full blur-3xl"
        ></div>
        <div
          class="relative overflow-hidden rounded-t-2xl border border-b-0 border-neutral-700 bg-neutral-900 p-2 shadow-2xl md:rounded-t-3xl md:p-3"
        >
          <div class="mb-2 flex items-center justify-between px-2 py-1 md:mb-3">
            <div class="flex gap-1.5">
              <span class="size-2 rounded-full bg-neutral-600"></span>
              <span class="size-2 rounded-full bg-neutral-600"></span>
              <span class="size-2 rounded-full bg-neutral-600"></span>
            </div>
            <div
              class="text-default-font/45 rounded-full border border-neutral-700 bg-neutral-950 px-3 py-1 font-mono text-[10px]"
            >
              panel.falixer.dev
            </div>
            <div class="w-8"></div>
          </div>
          <NuxtImg
            src="/img/pterodactyl2_edited.jpeg"
            alt="Falixer 扩展管理界面"
            class="w-full rounded-xl border border-neutral-700"
          />
        </div>
        <div
          class="absolute -left-3 bottom-8 hidden rounded-2xl border border-neutral-700 bg-neutral-950/95 p-4 text-left shadow-lg backdrop-blur md:block"
        >
          <div class="flex items-center gap-3">
            <span
              class="bg-success-0 text-success-300 flex size-8 items-center justify-center rounded-full"
            >
              <Icon name="lucide:check" :size="16" />
            </span>
            <div>
              <p class="text-sm font-semibold">扩展安装完成</p>
              <p class="text-default-font/45 mt-0.5 text-xs">
                依赖与版本已自动校验
              </p>
            </div>
          </div>
        </div>
        <div
          class="absolute -right-3 top-16 hidden rounded-2xl border border-neutral-700 bg-neutral-950/95 p-4 text-left shadow-lg backdrop-blur lg:block"
        >
          <p class="text-default-font/40 font-mono text-[10px]">
            ACTIVE PANELS
          </p>
          <p class="mt-1 text-2xl font-semibold tracking-tight">
            {{ panelcount }}+
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const panelcount = ref(2500)

onMounted(async () => {
  const data = await $fetch('/api/stats/panels', {
    method: 'GET',
  })

  // @ts-expect-error
  panelcount.value = data.total
})
</script>
