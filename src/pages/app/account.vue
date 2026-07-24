<template>
  <div class="space-y-2">
    <p class="text-brand-50 text-sm font-semibold tracking-widest">
      账户与安全
    </p>
    <h1>账户设置</h1>
    <p class="text-default-font/65">管理个人资料、登录凭据与第三方账户连接。</p>
  </div>

  <client-only>
    <div class="space-y-5">
      <UiAppUserProfile />
      <UiAppUserPassword />
      <UiAppUserSessions />
      <div
        class="grid grid-cols-1 gap-[1px] overflow-hidden rounded-3xl border border-neutral-700 bg-neutral-700 lg:grid-cols-2"
      >
        <UiAppUserTwofactor />
        <UiAppUserGithub />
      </div>
    </div>
  </client-only>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'user',
  layout: 'dashboard',
})
</script>
