<template>
  <div :class="props?.class" class="border-y border-neutral-700 py-8 md:py-10">
    <div
      class="grid grid-cols-2 gap-y-8 md:grid-cols-4 md:divide-x md:divide-neutral-700"
    >
      <div
        v-for="item in features"
        :key="item.label"
        class="px-4 first:ps-0 md:px-8 md:first:ps-0"
      >
        <div class="text-default-font/40 mb-3 flex items-center gap-2">
          <Icon :name="item.icon" :size="17" mode="svg" />
          <span class="font-mono text-[10px] uppercase tracking-[0.16em]">{{
            item.eyebrow
          }}</span>
        </div>
        <p class="text-lg font-semibold tracking-tight md:text-xl">
          {{ item.label }}
        </p>
        <p class="text-default-font/50 mt-1 text-sm leading-6">
          {{ item.caption }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  class: {
    type: String,
    required: false,
  },
})
const features = [
  {
    eyebrow: 'Install',
    label: '一条命令安装',
    icon: 'memory:cube',
    caption: '自动处理文件、依赖与版本校验',
  },
  {
    eyebrow: 'Workflow',
    label: '完整生命周期',
    icon: 'memory:application-code',
    caption: '安装、更新与移除保持一致',
  },
  {
    eyebrow: 'Reliable',
    label: '稳定且可恢复',
    icon: 'memory:time-sand',
    caption: '减少手动修改带来的冲突风险',
  },
  {
    eyebrow: 'Commercial',
    label: '商业授权',
    icon: 'lucide:badge-check',
    caption: '闭源付费框架，购买授权后使用',
  },
]
</script>
