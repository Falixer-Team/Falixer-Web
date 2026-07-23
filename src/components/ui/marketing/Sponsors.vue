<template>
  <section
    :class="props.class"
    class="overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-950"
  >
    <div class="grid md:grid-cols-[210px_1fr] md:divide-x md:divide-neutral-700">
      <div class="flex flex-col justify-center border-b border-neutral-700 px-5 py-5 md:border-b-0 md:px-6">
        <div
          class="mb-2 flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-brand-50 uppercase"
        >
          <span class="size-1.5 rounded-full bg-brand-50" />
          Partners
        </div>
        <h2 class="text-lg font-semibold tracking-tight">合作伙伴</h2>
        <NuxtLink
          to="https://hcb.hackclub.com/donations/start/blueprint"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-2 w-fit text-xs text-neutral-300 transition-colors hover:text-brand-50"
        >
          申请成为赞助商 →
        </NuxtLink>
      </div>

      <div class="grid sm:grid-cols-2 xl:grid-cols-3">
        <component
          :is="partner.url ? NuxtLink : 'div'"
          v-for="partner in partners"
          :key="partner.name"
          :to="partner.url"
          :target="partner.url ? '_blank' : undefined"
          :rel="partner.url ? 'noopener noreferrer' : undefined"
          class="group flex min-h-28 items-center gap-4 border-neutral-700 px-5 py-4 transition-colors hover:bg-neutral-900 focus:bg-neutral-900 focus:outline-none sm:border-r sm:last:border-r-0 xl:min-w-0"
        >
          <div
            class="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-700 bg-white p-2"
          >
            <img
              v-if="partner.logo"
              :src="partner.logo"
              :alt="`${partner.name}品牌标志`"
              class="max-h-full max-w-full object-contain"
            />
            <span v-else class="text-sm font-bold text-neutral-950">
              {{ partner.mark }}
            </span>
          </div>

          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <h3 class="truncate text-sm font-semibold tracking-tight">
                {{ partner.name }}
              </h3>
              <Icon
                v-if="partner.url"
                name="memory:arrow-up-right"
                mode="svg"
                :size="14"
                class="shrink-0 text-neutral-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-50"
              />
            </div>
            <p class="mt-1 text-xs font-medium text-brand-50">
              {{ partner.category }}
            </p>
            <p class="mt-1 line-clamp-2 text-xs leading-5 text-neutral-300">
              {{ partner.description }}
            </p>
          </div>
        </component>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { NuxtLink } from '#components'

const props = defineProps<{
  class?: string
}>()

const partners = [
  {
    name: '蓝点云',
    category: '基础设施合作伙伴',
    description: '提供稳定可靠的云端基础设施支持。',
    logo: 'https://r2.landdy.cn/1.png',
    mark: '',
    url: 'https://www.lancloud.top',
  },
  {
    name: '云服务伙伴',
    category: '示例展示位',
    description: '适合云计算、网络及存储服务伙伴。',
    logo: '',
    mark: 'CLOUD',
    url: '',
  },
  {
    name: '开发者社区',
    category: '示例展示位',
    description: '适合技术社区与生态内容合作伙伴。',
    logo: '',
    mark: 'DEV',
    url: '',
  },
]
</script>
