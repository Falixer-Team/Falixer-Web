<template>
  <div class="relative overflow-hidden">
    <div
      class="bg-brand-50/8 pointer-events-none absolute inset-x-0 -top-40 mx-auto h-96 max-w-4xl rounded-full blur-3xl"
    />

    <section class="relative mx-auto max-w-4xl pt-8 text-center md:pt-14">
      <div
        class="text-default-font/60 mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs"
      >
        <Icon name="lucide:key-round" :size="14" class="text-brand-50" />
        <span>Falixer 授权方案</span>
      </div>
      <h1 class="text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
        选择适合你的授权
      </h1>
      <p
        class="text-default-font/55 mx-auto mt-5 max-w-2xl text-base leading-7 md:text-lg"
      >
        每份授权绑定一个 Pterodactyl
        面板。个人非商业用途可申请免费授权，商业用途请选择付费方案。
      </p>
    </section>

    <section
      class="relative mx-auto mt-12 max-w-5xl overflow-hidden rounded-3xl border border-neutral-700 bg-neutral-900/65 p-6 shadow-sm md:flex md:items-center md:justify-between md:p-8"
    >
      <div class="max-w-2xl">
        <div class="flex flex-wrap items-center gap-2">
          <span
            class="bg-brand-700 text-brand-100 rounded-full px-2.5 py-1 text-xs font-semibold"
          >
            个人专享
          </span>
          <span
            class="text-default-font/50 rounded-full border border-neutral-700 px-2.5 py-1 text-xs"
          >
            ¥0 / 永久
          </span>
        </div>
        <h2 class="mt-4 text-2xl font-semibold tracking-tight">个人免费授权</h2>
        <p class="text-default-font/55 mt-2 leading-7">
          仅限个人学习、自用和非营利项目。禁止用于商业托管、收费服务、企业业务、客户项目或任何直接与间接盈利场景。
        </p>
        <div
          class="text-default-font/65 mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm"
        >
          <span class="flex items-center gap-1.5">
            <Icon name="lucide:check" :size="15" class="text-success-100" />
            绑定 1 个面板
          </span>
          <span class="flex items-center gap-1.5">
            <Icon name="lucide:check" :size="15" class="text-success-100" />
            个人非商业使用
          </span>
          <span class="flex items-center gap-1.5">
            <Icon name="lucide:x" :size="15" class="text-error-100" />
            禁止商业用途
          </span>
        </div>
      </div>
      <NuxtLink
        to="/guides/admin/install?license=personal"
        class="hover:border-brand-50 hover:text-brand-50 mt-6 inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-neutral-600 bg-neutral-950 px-5 py-2.5 text-sm font-semibold transition-colors md:ms-8 md:mt-0"
      >
        选择免费授权
        <Icon name="lucide:arrow-right" :size="16" />
      </NuxtLink>
    </section>

    <section class="relative mt-16 pb-10">
      <div
        class="mb-7 flex flex-col justify-between gap-2 md:flex-row md:items-end"
      >
        <div>
          <p
            class="text-brand-50 font-mono text-xs uppercase tracking-[0.16em]"
          >
            Commercial plans
          </p>
          <h2 class="mt-2 text-3xl font-semibold tracking-tight">商业授权</h2>
        </div>
        <p class="text-default-font/45 text-sm">所有商业方案均绑定 1 个面板</p>
      </div>

      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="plan in plans"
          :key="plan.name"
          class="min-h-112 relative flex flex-col rounded-3xl border bg-neutral-950 p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
          :class="
            plan.recommended
              ? 'border-brand-50 ring-brand-50/20 shadow-md ring-1'
              : 'border-neutral-700'
          "
        >
          <span
            v-if="plan.recommended"
            class="bg-brand-50 absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm"
          >
            推荐选择
          </span>

          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">{{ plan.name }}</h3>
            <Icon :name="plan.icon" :size="19" class="text-default-font/35" />
          </div>
          <p class="text-default-font/50 mt-3 min-h-12 text-sm leading-6">
            {{ plan.description }}
          </p>

          <div class="mt-7 flex items-end gap-1">
            <span class="pb-1 text-lg font-medium">¥</span>
            <span class="text-5xl font-semibold tracking-[-0.06em]">{{
              plan.price
            }}</span>
            <span class="text-default-font/40 pb-1.5 text-sm"
              >/{{ plan.period }}</span
            >
          </div>
          <p class="text-default-font/40 mt-2 text-xs">{{ plan.billing }}</p>

          <div class="my-6 h-px bg-neutral-700" />
          <ul class="text-default-font/65 space-y-3 text-sm">
            <li
              v-for="feature in plan.features"
              :key="feature"
              class="flex gap-2"
            >
              <Icon
                name="lucide:check"
                :size="16"
                class="text-brand-50 mt-0.5 shrink-0"
              />
              <span>{{ feature }}</span>
            </li>
          </ul>

          <NuxtLink
            :to="`/guides/admin/install?license=${plan.id}`"
            class="mt-auto flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all"
            :class="
              plan.recommended
                ? 'bg-brand-50 hover:bg-brand-100 text-white'
                : 'hover:border-brand-50 hover:text-brand-50 border border-neutral-700'
            "
          >
            选择{{ plan.name }}
            <Icon name="lucide:arrow-up-right" :size="15" />
          </NuxtLink>
        </article>
      </div>
    </section>

    <section
      class="mx-auto max-w-3xl border-t border-neutral-700 py-10 text-center"
    >
      <p class="text-default-font/45 text-sm leading-6">
        Falixer
        为商业闭源软件。禁止共享授权、转售程序文件、破解或绕过授权验证。付费入口上线前，请联系
        Falixer 官方完成购买。
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
const plans = [
  {
    id: 'monthly',
    name: '月付授权',
    price: '19.90',
    period: '月',
    billing: '每月续费，可灵活停止',
    description: '适合短期项目或首次用于商业环境。',
    icon: 'lucide:calendar-days',
    features: [
      '1 个 Pterodactyl 面板',
      '允许商业用途',
      '授权期内版本更新',
      '基础授权支持',
    ],
  },
  {
    id: 'quarterly',
    name: '季付授权',
    price: '58.80',
    period: '季',
    billing: '每 3 个月续费',
    description: '适合稳定运营中的小型商业面板。',
    icon: 'lucide:calendar-range',
    features: [
      '1 个 Pterodactyl 面板',
      '允许商业用途',
      '授权期内版本更新',
      '基础授权支持',
    ],
  },
  {
    id: 'yearly',
    name: '年付授权',
    price: '199',
    period: '年',
    billing: '每 12 个月续费，综合性价比更高',
    description: '适合长期运营与持续提供服务的面板。',
    icon: 'lucide:badge-check',
    recommended: true,
    features: [
      '1 个 Pterodactyl 面板',
      '允许商业用途',
      '授权期内版本更新',
      '优先授权支持',
    ],
  },
  {
    id: 'lifetime',
    name: '永久授权',
    price: '499',
    period: '永久',
    billing: '一次购买，无需续费',
    description: '适合长期持有并持续运营的商业项目。',
    icon: 'lucide:infinity',
    features: [
      '1 个 Pterodactyl 面板',
      '允许商业用途',
      '永久使用授权',
      '长期版本更新',
    ],
  },
]

useSeoMeta({
  title: 'Falixer 授权价格',
  description:
    '查看 Falixer 个人免费授权及月付、季付、年付和永久商业授权方案。',
  ogTitle: 'Falixer 授权价格',
  ogDescription: '选择适合个人或商业用途的 Falixer 授权方案。',
})

defineOgImageComponent('Large', {
  title: 'Falixer 授权价格',
})
</script>
