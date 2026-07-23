<template>
  <div
    :class="props.class"
    class="grid grid-cols-1 overflow-hidden rounded-3xl border border-neutral-700 bg-neutral-950 focus-within:border-neutral-500 md:grid-cols-2"
  >
    <div
      class="border-neutral-700 bg-neutral-700 transition-colors focus-within:border-neutral-500 focus-within:bg-neutral-500 md:border-e"
    >
      <ElementsAccordion :items="items" :default="0" />
    </div>
    <div class="relative hidden overflow-hidden md:block">
      <NuxtImg
        src="/img/gradient.jpeg"
        :width="1280"
        :height="450"
        class="h-full w-full object-cover"
      />
      <Icon
        name="memory:tooltip-above-help"
        mode="svg"
        :size="96"
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NuxtLink } from '#components'

const props = defineProps({
  class: {
    type: String,
    required: false,
  },
})

const items = [
  {
    title: 'Falixer 是什么？',
    text: 'Falixer 是面向 Pterodactyl 的模组平台。我们为开发者提供业界领先的开发工具，也让系统管理员更轻松地管理扩展。',
  },
  {
    title: '在哪里可以找到扩展？',
    inner: () => {
      return [
        h('span', {}, '你可以'),
        h(
          NuxtLink,
          {
            to: '/browse',
            class: 'text-link',
          },
          () => '在这里浏览经过我们验证的扩展'
        ),
        h('span', {}, '。未列出的扩展可能不符合我们的兼容性和安全标准。'),
      ]
    },
  },
  {
    title: 'Falixer 支持 Pterodactyl 分支吗？',
    text: '不支持。目前 Falixer 不兼容 Pterodactyl 的替代版本，包括各类分支。',
  },
  {
    title: 'Falixer 是 Pterodactyl 的分支吗？',
    text: '不是。Falixer 需要安装在原版 Pterodactyl 之上才能正常运行。',
  },
  {
    title: '独立修改兼容吗？',
    inner: () => {
      return [
        h(
          'span',
          {},
          '不兼容。独立修改（未使用 Falixer 制作的主题/附加组件）通常会无差别覆盖 Falixer 的核心文件。 '
        ),
        h(
          NuxtLink,
          {
            to: '/browse',
            class: 'text-link',
          },
          () => '寻找兼容 Falixer 的替代方案'
        ),
        h('span', {}, '，或者请该修改的开发者进行移植。'),
      ]
    },
  },
  {
    title: 'Falixer 是开源且免费的吗？',
    inner: () => {
      return [
        h(
          'span',
          {},
          '不是。Falixer 是商业闭源框架，不公开源代码，也不提供免费使用。安装和使用前需要购买有效的商业授权，具体价格与授权范围请以官方购买页面为准。'
        ),
      ]
    },
  },
]
</script>
