<template>
  <NuxtLink
    :to="props.to"
    :target="props.target"
    :class="props.class"
    class="hover:text-brand-50 focus-visible:border-neutral-500 flex cursor-pointer items-center rounded-full border border-neutral-700 bg-neutral-900 px-2.5 py-0.5 text-sm outline-none transition-colors hover:bg-neutral-800"
  >
    {{ props.label }}
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  class?: string
  label: string
  to: string
  target?:
    | '_blank'
    | '_parent'
    | '_self'
    | '_top'
    | (string & {})
    | null
    | undefined
}>()
</script>
