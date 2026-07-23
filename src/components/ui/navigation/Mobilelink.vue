<template>
  <NuxtLink
    :to="props.to"
    :target="props.target"
    class="hover:text-brand-50 group flex min-h-11 items-center justify-between gap-2 opacity-0 transition-all duration-500"
    :class="visible ? 'opacity-100' : ''"
  >
    <span
      class="group-hover:text-brand-50 text-xl leading-tight font-medium transition-colors"
    >
      {{ props.label }}
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  visible: boolean
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
