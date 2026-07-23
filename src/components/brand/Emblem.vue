<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="props.size || 32"
    :height="props.size || 32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    :class="props.class"
  >
    <path
      d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
    ></path>
    <path d="m9 12 2 2 4-4"></path>
  </svg>
</template>

<script setup lang="ts">
const props = defineProps({
  size: {
    type: Number,
    required: false,
  },
  class: {
    type: String,
    required: false,
  },
  fill: {
    type: String,
    required: false,
  },
})
</script>
