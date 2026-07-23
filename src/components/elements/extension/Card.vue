<template>
  <article
    :class="props.class"
    :data-extension-type="props.extension?.type"
    class="h-full overflow-hidden rounded-3xl border border-neutral-700 bg-neutral-950 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-neutral-500 hover:shadow-md"
  >
    <NuxtLink
      :to="
        props.extension && !props.to
          ? `/browse/${props.extension.identifier}`
          : props.to
            ? props.to
            : ''
      "
      class="group flex h-full flex-col outline-none focus-visible:ring-4 focus-visible:ring-brand-50/20"
    >
      <div
        class="flex h-full flex-col bg-neutral-950 p-3 transition-colors group-hover:bg-neutral-900/60 sm:p-4"
      >
        <div
          v-if="props.extension"
          class="relative aspect-video w-full overflow-hidden rounded-2xl bg-neutral-900"
        >
          <NuxtImg
            :src="props.extension.banner.lowres"
            :alt="`${props.extension.name} 封面`"
            class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div class="absolute left-3 top-3 flex gap-2">
            <span
              class="rounded-full border border-white/20 bg-black/55 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur"
            >
              {{ props.extension.type === 'theme' ? '主题' : '扩展' }}
            </span>
          </div>
        </div>
        <div
          v-else
          class="aspect-video w-full overflow-hidden rounded-2xl bg-neutral-900"
        >
          <div class="h-full w-full animate-pulse bg-neutral-900" />
        </div>

        <div v-if="props.extension" class="flex flex-1 flex-col pt-4">
          <div class="flex flex-row items-start justify-between gap-3">
            <h2
              class="group-hover:text-brand-50 line-clamp-1 text-xl! transition-colors"
            >
              {{ props.extension.name }}
            </h2>
            <span
              class="bg-brand-50/10 text-brand-50 shrink-0 rounded-full px-2.5 py-1 text-xs font-bold"
            >
              {{ priceLabel }}
            </span>
          </div>
          <p class="text-default-font/60 mt-2 line-clamp-2 min-h-10 text-sm leading-5">
            {{ props.extension.summary }}
          </p>
          <div
            class="text-default-font/50 mt-auto flex items-center justify-between gap-3 border-t border-neutral-700 pt-3 text-xs"
          >
            <span class="flex min-w-0 items-center gap-1.5 truncate">
              <Icon name="memory:account" :size="15" />
              {{ props.extension.author.name }}
            </span>
            <span
              class="flex shrink-0 items-center gap-1.5"
              :aria-label="`${props.extension.stats.panels} 个面板正在使用`"
            >
              <Icon name="memory:chart-bar" :size="15" />
              {{ formatCount(props.extension.stats.panels) }} 次安装
            </span>
          </div>
        </div>
        <div v-else class="space-y-3 pt-4">
          <div class="h-6 w-2/5 animate-pulse rounded-xl bg-neutral-900" />
          <div class="h-10 w-full animate-pulse rounded-xl bg-neutral-900" />
          <div class="h-5 w-3/4 animate-pulse rounded-xl bg-neutral-900" />
        </div>
      </div>
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
const props = defineProps<{
  extension?: Extension
  class?: any
  to?: string
}>()

const lowestPrice = computed(() => {
  if (!props.extension?.platforms) {
    return null
  }

  const platformsArray = Object.values(
    props.extension.platforms
  ) as unknown as ExtensionPlatform[]

  if (platformsArray.length === 0) {
    return null
  }

  const lowest: ExtensionPlatform = platformsArray.reduce((lowest, current) =>
    current.price < lowest.price ? current : lowest
  )

  return {
    price: lowest.price,
    currency: lowest.currency,
  }
})

const currencySymbols: Record<string, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
}

const priceLabel = computed(() => {
  if (!lowestPrice.value || lowestPrice.value.price === 0) return '免费'
  const symbol = currencySymbols[lowestPrice.value.currency] || ''
  return `${symbol}${lowestPrice.value.price.toFixed(2)} 起`
})

const formatCount = (count: number) =>
  new Intl.NumberFormat('zh-CN', { notation: 'compact' }).format(count)
</script>
