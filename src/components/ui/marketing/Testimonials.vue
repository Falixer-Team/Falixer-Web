<template>
  <section
    :class="props.class"
    class="overflow-hidden rounded-3xl border border-neutral-700 bg-neutral-950"
  >
    <div
      class="grid gap-6 border-b border-neutral-700 px-6 py-7 md:grid-cols-[1fr_auto] md:items-end md:px-8"
    >
      <div>
        <p
          class="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-brand-50 uppercase"
        >
          <span class="h-px w-7 bg-brand-50" />
          用户评价
        </p>
        <h2 class="text-2xl font-semibold tracking-tight md:text-3xl">
          来自真实用户的使用体验
        </h2>
        <p class="mt-2 max-w-xl text-sm leading-6 text-neutral-300">
          从扩展开发到生产部署，Falixer 帮助用户更高效、更稳定地管理
          Pterodactyl。
        </p>
      </div>

      <div class="flex items-center gap-4 md:text-right">
        <div>
          <div class="flex gap-1 text-brand-50" aria-label="平均评分 4.9 分">
            <span v-for="star in 5" :key="star" aria-hidden="true">★</span>
          </div>
          <p class="mt-1 text-xs text-neutral-300">18 位用户真实反馈</p>
        </div>
        <strong class="text-3xl font-semibold tracking-tight">4.9</strong>
      </div>
    </div>

    <div class="relative py-5">
      <div
        class="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-neutral-950 to-transparent"
      />
      <div
        class="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-neutral-950 to-transparent"
      />

      <div class="space-y-4">
        <ElementsMarquee
          v-for="(testimonials, rowIndex) in allTestimonials"
          :key="rowIndex"
          :speed="16"
          :direction="rowIndex % 2 === 0 ? 'left' : 'right'"
          :pause-on-hover="true"
          tabindex="-1"
        >
          <article
            v-for="testimonial in testimonials"
            :key="testimonial.name"
            class="group mx-2 flex h-44 w-88 flex-col justify-between border border-neutral-700 bg-neutral-900 p-5 transition-colors hover:border-brand-50/35 hover:bg-brand-50/5"
          >
            <div>
              <span class="mb-3 block text-2xl leading-none text-brand-50" aria-hidden="true">“</span>
              <p class="line-clamp-3 text-sm leading-6 text-neutral-200">
                {{ testimonial.content }}
              </p>
            </div>

            <div class="flex items-end justify-between gap-4">
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold">
                  {{ testimonial.name }}
                </p>
                <p class="mt-0.5 text-xs text-neutral-300">
                  {{ testimonial.role }}
                </p>
              </div>
              <div
                class="flex shrink-0 gap-0.5 text-brand-50"
                :aria-label="`${testimonial.rating} 星评价`"
              >
                <span
                  v-for="star in testimonial.rating"
                  :key="star"
                  class="text-xs"
                  aria-hidden="true"
                >★</span>
              </div>
            </div>
          </article>
        </ElementsMarquee>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  class?: string
}>()

const allTestimonials = [
  [
    {
      name: '远景科技',
      role: '面板服务商',
      content: '安装流程清晰，扩展管理也比手动修改文件稳定许多，日常维护时间明显减少。',
      rating: 5,
    },
    {
      name: '林川',
      role: '扩展开发者',
      content: '开发规范和工具链很完整，不需要反复处理核心文件冲突，可以把精力放在功能本身。',
      rating: 5,
    },
    {
      name: '云栈互联',
      role: '服务器运营团队',
      content: '在多个生产面板中表现稳定，版本更新和扩展部署都更加可控。',
      rating: 5,
    },
    {
      name: '周屿',
      role: '个人用户',
      content: '即使没有太多开发经验，也能按照中文指南完成安装和后续管理。',
      rating: 5,
    },
    {
      name: '星海网络',
      role: '游戏社区运营者',
      content: '统一的扩展管理方式减少了兼容问题，面板升级时也更安心。',
      rating: 5,
    },
  ],
  [
    {
      name: '北辰云',
      role: '云服务团队',
      content: 'Falixer 让扩展交付更加标准化，适合需要长期维护的商业环境。',
      rating: 5,
    },
    {
      name: '陈默',
      role: '系统管理员',
      content: '扩展安装和卸载都很直观，不再需要逐个排查被覆盖的面板文件。',
      rating: 5,
    },
    {
      name: '凌云工作室',
      role: '扩展制作团队',
      content: '文档结构清楚，开发体验统一，团队成员上手速度比以前快很多。',
      rating: 5,
    },
    {
      name: '苏言',
      role: '独立开发者',
      content: '最满意的是稳定性与可维护性，出现问题时也更容易定位和处理。',
      rating: 4,
    },
    {
      name: '矩阵互联',
      role: '托管服务商',
      content: '用于生产业务后，扩展冲突明显减少，整体运维流程更简洁。',
      rating: 5,
    },
  ],
]
</script>
