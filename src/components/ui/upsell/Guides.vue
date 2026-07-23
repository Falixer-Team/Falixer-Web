<template>
  <div
    v-if="upsell.enabled"
    class="group cursor-pointer overflow-hidden rounded-3xl border-neutral-700 bg-neutral-900 max-md:mb-12 max-md:border md:rounded-none md:border-b"
    ref="container"
    :style="`background: url('${upsell.banner}') no-repeat; background-size: cover; background-position: right;`"
    @click="link?.click()"
  >
    <div
      class="bg-linear-to-r min-h-25 flex w-full flex-col gap-2 from-neutral-900 via-neutral-900 via-40% to-neutral-950/50 p-4 md:p-8"
    >
      <h2>{{ upsell.title }}</h2>
      <p>
        {{ upsell.description }}
      </p>
      <a :href="upsell.button.url" tabindex="-1" ref="link">
        <button
          class="text-brand-50 flex cursor-pointer items-center gap-1 font-bold transition-all group-hover:gap-2"
        >
          <span> {{ upsell.button.content }} </span>
          <Icon name="memory:chevron-right" :size="22" />
        </button>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GuidesCollectionItem } from '@nuxt/content'

const link = useTemplateRef('link')
const container = useTemplateRef('container')
const props = defineProps<{
  data: GuidesCollectionItem
}>()

const upsell = ref<{
  enabled: boolean
  title: string
  description: string
  banner: string
  button: {
    content: string
    url: string
  }
}>({
  enabled: false,
  title: '',
  description: '',
  banner: '',
  button: {
    content: '',
    url: '',
  },
})

// these are static anyways, might as well ssr
if (props.data.category == 'extra') {
  upsell.value = {
    enabled: true,
    title: '游戏托管行业正在使用 Falixer',
    description:
      '专为 Pterodactyl 打造的扩展平台，帮助你开发、协作并安装高质量扩展。',
    banner: '/img/infoblur_alt.jpeg',
    button: {
      content: '了解更多',
      url: '/',
    },
  }
} else if (props.data.path == '/guides/admin/remove') {
  upsell.value = {
    enabled: true,
    title: '期待再次与你相见',
    description:
      '欢迎告诉我们可以改进的地方，填写反馈只需一分钟。',
    banner: '/img/removesurveyupsell.jpeg',
    button: {
      content: '提交反馈',
      url: 'https://forms.blueprint.zip/exit-feedback',
    },
  }
}
</script>
