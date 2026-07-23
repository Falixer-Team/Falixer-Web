<template>
  <div
    class="grid grid-cols-2 rounded-2xl border border-neutral-700 bg-neutral-900 p-1 xl:flex"
    role="radiogroup"
    aria-label="项目类型"
  >
    <button
      type="button"
      data-browse-type-toggle="extension"
      role="radio"
      class="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold outline-none transition"
      :class="
        props.form.showExtensions
          ? 'bg-neutral-950 text-default-font shadow-sm'
          : 'text-default-font/45 hover:text-default-font'
      "
      :aria-checked="props.form.showExtensions"
      @click="emit('update', { showExtensions: true, showThemes: false })"
    >
      <Icon name="memory:cube" :size="18" />
      <span>扩展</span>
    </button>
    <button
      type="button"
      data-browse-type-toggle="theme"
      role="radio"
      class="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold outline-none transition"
      :class="
        props.form.showThemes
          ? 'bg-neutral-950 text-default-font shadow-sm'
          : 'text-default-font/45 hover:text-default-font'
      "
      :aria-checked="props.form.showThemes"
      @click="emit('update', { showExtensions: false, showThemes: true })"
    >
      <Icon name="memory:image" :size="18" />
      <span>主题</span>
    </button>
  </div>

  <label class="relative xl:min-w-44">
    <span class="sr-only">排序方式</span>
    <Icon
      name="memory:format-text-single-line"
      :size="18"
      class="text-default-font/45 pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
    />
    <select
      :value="props.form.sortBy"
      class="text-default-font focus:border-brand-50 focus:ring-brand-50/15 h-12 w-full appearance-none rounded-2xl border border-neutral-700 bg-neutral-900 pl-10 pr-9 text-sm font-semibold outline-none transition focus:ring-4"
      aria-label="排序方式"
      @change="
        emit('update', {
          sortBy: ($event.target as HTMLSelectElement).value,
        })
      "
    >
      <option
        v-for="sortOption in sortOptions"
        :key="sortOption.value"
        :value="sortOption.value"
      >
        {{ sortOption.label }}
      </option>
    </select>
    <Icon
      name="memory:chevron-down"
      :size="18"
      class="text-default-font/45 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
    />
  </label>
</template>

<script setup lang="ts">
const props = defineProps<{
  form: {
    sortBy: string
    showExtensions: boolean
    showThemes: boolean
  }
}>()

const emit = defineEmits<{
  update: [
    changes: Partial<{
      sortBy: string
      showExtensions: boolean
      showThemes: boolean
    }>,
  ]
}>()

const sortOptions = [
  { value: 'popularity', label: '最受欢迎' },
  { value: 'name', label: '名称 A–Z' },
  { value: 'created', label: '最新发布' },
]
</script>
