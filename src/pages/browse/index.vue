<template>
  <section
    class="relative overflow-hidden rounded-[2rem] border border-neutral-700 bg-neutral-950 px-5 py-10 shadow-sm sm:px-8 lg:px-12 lg:py-14"
  >
    <div
      class="bg-brand-50/10 absolute -right-16 -top-24 h-64 w-64 rounded-full blur-3xl"
    />
    <div class="relative max-w-3xl">
      <div
        class="text-brand-50 mb-5 inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm font-semibold"
      >
        <Icon name="memory:cube" :size="17" />
        Falixer 扩展市场
      </div>
      <h1 class="text-4xl! sm:text-5xl! lg:text-6xl! tracking-tight">
        为你的面板发现更多可能
      </h1>
      <p class="text-default-font/65 mt-5 max-w-2xl text-base leading-7 sm:text-lg">
        浏览经过整理的扩展与主题，快速找到适合 Pterodactyl 面板的功能和视觉方案。
      </p>
      <div class="mt-7 flex flex-wrap gap-5 text-sm">
        <span class="flex items-center gap-2">
          <Icon name="memory:check" class="text-brand-50" />
          已收录 {{ extensions?.length || 0 }} 个项目
        </span>
        <span class="flex items-center gap-2">
          <Icon name="memory:shield" class="text-brand-50" />
          清晰的来源与版本信息
        </span>
      </div>
    </div>
  </section>

  <section class="space-y-6">
    <div
      class="sticky top-[calc(var(--nav-offset)+0.75rem)] z-10 rounded-3xl border border-neutral-700 bg-neutral-950/95 p-3 shadow-sm backdrop-blur-xl sm:p-4"
    >
      <div class="flex flex-col gap-3 xl:flex-row xl:items-center">
        <label class="relative min-w-0 flex-1">
          <span class="sr-only">搜索扩展或主题</span>
          <Icon
            name="memory:search"
            :size="20"
            class="text-default-font/45 pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
          />
          <input
            v-model="form.search"
            type="search"
            name="search"
            autocomplete="off"
            placeholder="搜索名称、作者或关键词"
            class="text-default-font placeholder:text-default-font/40 focus:border-brand-50 focus:ring-brand-50/15 h-12 w-full rounded-2xl border border-neutral-700 bg-neutral-900 pl-11 pr-11 outline-none transition focus:ring-4"
          />
          <button
            v-if="form.search"
            type="button"
            aria-label="清除搜索"
            class="text-default-font/45 hover:text-default-font absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 transition"
            @click="form.search = ''"
          >
            <Icon name="memory:close" :size="18" />
          </button>
        </label>
        <UiBrowseFilters :form="form" @update="updateFilters" />
      </div>
    </div>

    <div class="flex items-center justify-between gap-4 px-1">
      <div>
        <h2 class="text-2xl!">探索项目</h2>
        <p class="text-default-font/55 mt-1 text-sm">
          共找到 {{ filteredAndSortedExtensions.length }} 个结果
        </p>
      </div>
      <button
        v-if="hasActiveFilters"
        type="button"
        class="text-brand-50 hover:bg-brand-50/10 rounded-xl px-3 py-2 text-sm font-semibold transition"
        @click="resetFilters"
      >
        重置筛选
      </button>
    </div>

    <div
      v-if="pending"
      class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-label="正在加载扩展"
    >
      <ElementsExtensionCard v-for="n in 8" :key="n" />
    </div>

    <div
      v-else-if="error"
      class="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-neutral-700 bg-neutral-950 p-8 text-center shadow-sm"
    >
      <div
        class="mb-4 flex size-14 items-center justify-center rounded-2xl bg-red-400/10 text-red-400"
      >
        <Icon name="memory:alert-circle" :size="28" />
      </div>
      <h3 class="text-xl font-bold">扩展列表加载失败</h3>
      <p class="text-default-font/55 mt-2">请检查网络连接，稍后重新尝试。</p>
      <button
        type="button"
        class="bg-brand-50 text-brand-900 mt-5 rounded-xl px-5 py-2.5 font-semibold"
        @click="refresh"
      >
        重新加载
      </button>
    </div>

    <div
      v-else-if="filteredAndSortedExtensions.length"
      data-browse-results
      class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <ElementsExtensionCard
        v-for="extension in filteredAndSortedExtensions"
        :key="extension.id"
        :extension="extension"
      />
    </div>

    <div
      v-else
      data-browse-empty
      class="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-700 bg-neutral-950 p-8 text-center"
    >
      <div
        class="mb-4 flex size-14 items-center justify-center rounded-2xl bg-neutral-900"
      >
        <Icon name="memory:search" :size="28" class="text-default-font/40" />
      </div>
      <h3 class="text-xl font-bold">没有找到匹配项目</h3>
      <p class="text-default-font/55 mt-2 max-w-md">
        尝试更换关键词，或重置当前筛选条件。
      </p>
      <button
        type="button"
        class="text-brand-50 mt-5 font-semibold"
        @click="resetFilters"
      >
        重置筛选
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
const { data: extensions, pending, error, refresh } =
  await useAsyncData<Extension[]>(
  'extensions',
  () => $fetch<Extension[]>('/api/extensions'),
  {
    server: false,
  }
  )

const form = ref({
  search: '',
  sortBy: 'popularity',
  showExtensions: true,
  showThemes: false,
})

const filteredAndSortedExtensions = computed(() => {
  if (!extensions.value) return []

  let filtered = [...extensions.value]

  const searchTerm = form.value.search.trim().toLowerCase()
  if (searchTerm) {
    filtered = filtered.filter(
      (extension) =>
        extension.name.toLowerCase().includes(searchTerm) ||
        extension.identifier.toLowerCase().includes(searchTerm) ||
        extension.summary.toLowerCase().includes(searchTerm) ||
        extension.keywords.some((keyword) =>
          keyword.toLowerCase().includes(searchTerm)
        ) ||
        extension.author.name.toLowerCase().includes(searchTerm)
    )
  }

  filtered = filtered.filter((extension) => {
    if (extension.type === 'extension' && !form.value.showExtensions)
      return false
    if (extension.type === 'theme' && !form.value.showThemes) return false
    return true
  })

  switch (form.value.sortBy) {
    case 'popularity':
      filtered.sort((a, b) => b.stats.panels - a.stats.panels)
      break
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'created':
      filtered.sort(
        (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
      )
      break
  }

  return filtered
})

const hasActiveFilters = computed(
  () =>
    form.value.search !== '' ||
    form.value.sortBy !== 'popularity' ||
    !form.value.showExtensions
)

const resetFilters = () => {
  form.value.search = ''
  form.value.sortBy = 'popularity'
  form.value.showExtensions = true
  form.value.showThemes = false
}

const updateFilters = (
  changes: Partial<{
    sortBy: string
    showExtensions: boolean
    showThemes: boolean
  }>
) => {
  Object.assign(form.value, changes)
}

const browseFilterFallback = `(() => {
  if (window.__falixerBrowseFilters) return;
  window.__falixerBrowseFilters = true;
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest('[data-browse-type-toggle]');
    if (!button) return;
    requestAnimationFrame(() => {
      const selectedType = button.getAttribute('data-browse-type-toggle');
      document.querySelectorAll('[data-browse-type-toggle]').forEach((typeButton) => {
        const selected = typeButton === button;
        typeButton.setAttribute('aria-checked', String(selected));
        typeButton.classList.toggle('bg-neutral-950', selected);
        typeButton.classList.toggle('text-default-font', selected);
        typeButton.classList.toggle('shadow-sm', selected);
        typeButton.classList.toggle('text-default-font/45', !selected);
      });
      document.querySelectorAll('[data-extension-type]').forEach((card) => {
        card.toggleAttribute('hidden', card.getAttribute('data-extension-type') !== selectedType);
      });
    });
  });
})()`

useHead({
  script: [{ key: 'browse-filter-fallback', innerHTML: browseFilterFallback }],
})
</script>
