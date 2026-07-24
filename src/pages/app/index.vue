<template>
  <div
    class="relative overflow-hidden rounded-3xl border border-neutral-700 bg-neutral-950 p-6 md:p-8"
  >
    <div
      class="bg-brand-500/10 absolute -right-16 -top-20 h-56 w-56 rounded-full blur-3xl"
    />
    <div
      class="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
    >
      <div class="space-y-2">
        <p class="text-brand-50 text-sm font-semibold tracking-widest">
          用户中心
        </p>
        <div class="flex flex-wrap items-center gap-3">
          <h1>你好，{{ user?.name }}</h1>
          <ElementsTextbadge label="已登录" icon="memory:check" />
        </div>
        <p class="text-default-font/65 max-w-2xl">
          在这里管理你的账户安全、授权、扩展和使用数据。
        </p>
      </div>
      <div
        class="flex items-center gap-2 rounded-2xl border border-neutral-700 bg-neutral-900/70 px-4 py-3"
      >
        <Icon name="memory:email" :size="20" />
        <span class="text-sm">{{ user?.email }}</span>
      </div>
    </div>
  </div>

  <UiAppVerifyemail v-if="user?.email_pending != null" />

  <div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
    <NuxtLink
      to="/app/account"
      class="group/card hover:border-brand-500/50 focus:border-brand-500/50 space-y-4 rounded-3xl border border-neutral-700 bg-neutral-950 p-5 outline-0 transition-all hover:-translate-y-1 hover:bg-neutral-900 focus:bg-neutral-900"
      @mousedown.prevent
    >
      <div class="flex items-center gap-1.5">
        <Icon name="memory:account-box" :size="28" mode="svg" />
        <span class="text-xl font-bold">账户设置</span>
      </div>
      <span class="text-default-font/75">
        管理个人资料、邮箱、密码、登录设备与双重验证
      </span>
    </NuxtLink>
    <NuxtLink
      to="/app/license"
      class="group/card hover:border-brand-500/50 focus:border-brand-500/50 space-y-4 rounded-3xl border border-neutral-700 bg-neutral-950 p-5 outline-0 transition-all hover:-translate-y-1 hover:bg-neutral-900 focus:bg-neutral-900"
      @mousedown.prevent
    >
      <div class="flex items-center gap-1.5">
        <Icon name="lucide:key-round" :size="28" mode="svg" />
        <span class="text-xl font-bold">授权中心</span>
      </div>
      <span class="text-default-font/75">
        使用兑换码绑定授权，或解除现有面板绑定
      </span>
    </NuxtLink>
    <NuxtLink
      to="/app/extensions"
      class="group/card hover:border-brand-500/50 focus:border-brand-500/50 space-y-4 rounded-3xl border border-neutral-700 bg-neutral-950 p-5 outline-0 transition-all hover:-translate-y-1 hover:bg-neutral-900 focus:bg-neutral-900"
      @mousedown.prevent
    >
      <div class="flex items-center gap-1.5">
        <Icon name="memory:cube" :size="28" mode="svg" />
        <span class="text-xl font-bold">扩展管理</span>
      </div>
      <span class="text-default-font/75">
        创建、配置、发布或下架你的扩展产品
      </span>
    </NuxtLink>
    <NuxtLink
      to="/app/stats"
      class="group/card hover:border-brand-500/50 focus:border-brand-500/50 space-y-4 rounded-3xl border border-neutral-700 bg-neutral-950 p-5 outline-0 transition-all hover:-translate-y-1 hover:bg-neutral-900 focus:bg-neutral-900"
      @mousedown.prevent
    >
      <div class="flex items-center gap-1.5">
        <Icon name="memory:chart-bar" :size="28" mode="svg" />
        <span class="text-xl font-bold">数据统计</span>
      </div>
      <span class="text-default-font/75">
        查看面板趋势、扩展数据与可视化图表
      </span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'user-verified',
  layout: 'dashboard',
})

const { user } = useAuth()
</script>
