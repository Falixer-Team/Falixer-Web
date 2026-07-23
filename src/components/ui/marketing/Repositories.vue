<template>
  <div
    :class="props.class"
    class="grid gap-px overflow-hidden rounded-3xl border border-neutral-700 bg-neutral-700 transition-colors focus-within:border-neutral-500 focus-within:bg-neutral-500 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  >
    <NuxtLink
      to="https://github.com/blueprintframework/framework"
      class="hover:text-brand-50 focus:text-brand-50 group space-y-2 bg-neutral-950 p-4 outline-0 transition-colors hover:bg-neutral-900 focus:bg-neutral-900"
      target="_blank"
      @mousedown.prevent
    >
      <h2>
        <div class="flex overflow-hidden">
          blueprintframework/<wbr class="not-chrome:hidden" />framework
          <Icon
            name="memory:chevron-right"
            :size="24"
            class="opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100"
          />
        </div>
      </h2>
      <p class="text-default-font">底层扩展框架、CLI、开发者工具等。</p>
    </NuxtLink>
    <NuxtLink
      to="https://github.com/blueprintframework/web"
      class="hover:text-brand-50 focus:text-brand-50 group space-y-2 bg-neutral-950 p-4 outline-0 transition-colors hover:bg-neutral-900 focus:bg-neutral-900"
      target="_blank"
      @mousedown.prevent
    >
      <h2>
        <div class="flex overflow-hidden">
          blueprintframework/<wbr class="not-chrome:hidden" />web
          <Icon
            name="memory:chevron-right"
            :size="24"
            class="opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100"
          />
        </div>
      </h2>
      <p class="text-default-font">所有 Web 相关内容都在这里：API 和网站。</p>
    </NuxtLink>
    <NuxtLink
      to="https://github.com/blueprintframework/docker"
      class="hover:text-brand-50 focus:text-brand-50 group space-y-2 bg-neutral-950 p-4 outline-0 transition-colors hover:bg-neutral-900 focus:bg-neutral-900"
      target="_blank"
      @mousedown.prevent
    >
      <h2>
        <div class="flex overflow-hidden">
          blueprintframework/<wbr class="not-chrome:hidden" />docker
          <Icon
            name="memory:chevron-right"
            :size="24"
            class="opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100"
          />
        </div>
      </h2>
      <p class="text-default-font">
        你熟悉且喜爱的 Falixer 扩展生态，Docker 版。
      </p>
    </NuxtLink>
    <NuxtLink
      to="https://github.com/blueprintframework/templates"
      class="hover:text-brand-50 focus:text-brand-50 group space-y-2 bg-neutral-950 p-4 outline-0 transition-colors hover:bg-neutral-900 focus:bg-neutral-900"
      target="_blank"
      @mousedown.prevent
    >
      <h2>
        <div class="flex overflow-hidden">
          blueprintframework/<wbr class="not-chrome:hidden" />templates
          <Icon
            name="memory:chevron-right"
            :size="24"
            class="opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100"
          />
        </div>
      </h2>
      <p class="text-default-font">
        面向扩展开发者的起点，已集成到我们的 CLI 中。
      </p>
    </NuxtLink>
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
