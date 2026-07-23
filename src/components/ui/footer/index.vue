<template>
  <div>
    <div
      class="grid border-b border-neutral-700 lg:grid-cols-[minmax(0,1.15fr)_minmax(420px,1fr)]"
    >
      <div class="relative overflow-hidden border-b border-neutral-700 p-6 sm:p-8 lg:border-r lg:border-b-0 lg:p-10">
        <div
          class="pointer-events-none absolute -left-20 -top-28 size-64 rounded-full bg-brand-50/8 blur-3xl"
        />
        <div class="relative max-w-lg">
          <p class="mb-4 flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-brand-50 uppercase">
            <span class="h-px w-7 bg-brand-50" />
            Falixer Framework
          </p>
          <h2 class="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
            为 Pterodactyl 构建更好的扩展体验
          </h2>
          <p class="mt-3 max-w-md text-sm leading-6 text-neutral-300">
            商业闭源、持续维护，为生产环境提供稳定的扩展能力与技术支持。
          </p>
        </div>
      </div>

      <nav
        class="grid grid-cols-2 divide-x divide-y divide-neutral-700 sm:grid-cols-4 sm:divide-y-0 lg:grid-cols-2 lg:divide-y xl:grid-cols-4 xl:divide-y-0"
        aria-label="页脚导航"
      >
        <div
          v-for="group in linkGroups"
          :key="group.title"
          class="min-h-36 p-5 sm:p-6"
        >
          <p class="mb-4 text-xs font-semibold tracking-[0.14em] text-neutral-200 uppercase">
            {{ group.title }}
          </p>
          <div class="flex flex-col gap-2.5">
            <NuxtLink
              v-for="link in group.links"
              :key="link.label"
              :to="link.to"
              :external="link.external"
              class="group/link flex w-fit items-center gap-1.5 text-sm text-neutral-300 transition-colors hover:text-brand-50"
            >
              <span
                class="h-px w-0 bg-brand-50 transition-all group-hover/link:w-2"
              />
              {{ link.label }}
            </NuxtLink>
          </div>
        </div>
      </nav>
    </div>

    <div
      class="flex flex-col gap-2 px-6 py-4 text-xs text-neutral-300 sm:flex-row sm:items-center sm:justify-between sm:px-8"
    >
      <span>Falixer 是独立商业产品，与 Pterodactyl 项目无隶属关系。</span>
      <div class="flex items-center gap-4">
        <NuxtLink
          to="https://github.com/blueprintframework"
          class="transition-colors hover:text-brand-50"
        >
          GitHub
        </NuxtLink>
        <NuxtLink
          to="https://discord.com/servers/blueprint-1063548024825057451"
          class="transition-colors hover:text-brand-50"
        >
          Discord
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const linkGroups = [
  {
    title: '产品',
    links: [
      { label: '扩展', to: '/browse' },
      { label: '指南', to: '/guides' },
      { label: '文档', to: '/docs' },
      { label: '博客', to: '/blog' },
    ],
  },
  {
    title: '支持',
    links: [
      { label: 'HCB 捐赠', to: 'https://hcb.hackclub.com/donations/start/blueprint' },
      { label: 'GitHub Sponsors', to: 'https://github.com/sponsors/blueprintframework' },
      { label: '财务透明', to: 'https://hcb.hackclub.com/blueprint' },
    ],
  },
  {
    title: '法律',
    links: [
      { label: '服务条款', to: '/legal/terms' },
      { label: '隐私政策', to: '/legal/privacy' },
      { label: '行为准则', to: '/legal/conduct' },
    ],
  },
  {
    title: '社区',
    links: [
      { label: 'Discord', to: 'https://discord.com/servers/blueprint-1063548024825057451' },
      { label: 'GitHub', to: 'https://github.com/blueprintframework' },
      { label: 'API 文档', to: '/api', external: true },
    ],
  },
]
</script>
