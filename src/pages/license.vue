<template>
  <div class="relative overflow-hidden pb-12">
    <div
      class="bg-brand-50/8 pointer-events-none absolute inset-x-0 -top-36 mx-auto h-80 max-w-3xl rounded-full blur-3xl"
    />

    <section class="relative mx-auto max-w-3xl pt-4 text-center md:pt-10">
      <div
        class="text-default-font/60 mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs"
      >
        <Icon name="lucide:badge-check" :size="14" class="text-brand-50" />
        <span>Falixer License Lookup</span>
      </div>
      <h1 class="text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
        授权查询
      </h1>
      <p
        class="text-default-font/55 mx-auto mt-5 max-w-2xl text-base leading-7 md:text-lg"
      >
        输入授权绑定的面板域名或 IP，查询当前套餐和授权有效期。个人免费版同样支持查询。
      </p>
    </section>

    <section class="relative mx-auto mt-10 max-w-3xl md:mt-14">
      <form
        class="rounded-3xl border border-neutral-700 bg-neutral-950 p-5 shadow-sm md:p-8"
        @submit.prevent="lookupLicense"
      >
        <label for="license-target" class="text-sm font-semibold">
          面板域名或 IP
        </label>
        <p id="license-target-help" class="text-default-font/45 mt-1 text-sm">
          例如：panel.example.com、https://panel.example.com 或 192.0.2.10
        </p>

        <div class="mt-4 flex flex-col gap-3 sm:flex-row">
          <div class="relative grow">
            <Icon
              name="lucide:globe-2"
              :size="18"
              class="text-default-font/35 pointer-events-none absolute top-1/2 left-4 -translate-y-1/2"
            />
            <input
              id="license-target"
              v-model="query"
              type="text"
              inputmode="url"
              autocomplete="url"
              spellcheck="false"
              aria-describedby="license-target-help"
              :aria-invalid="status === 'invalid'"
              placeholder="输入绑定域名或 IP"
              class="focus:border-brand-50 focus:ring-brand-50/15 h-12 w-full rounded-2xl border border-neutral-700 bg-neutral-900 pr-4 pl-11 text-sm outline-none transition focus:ring-4"
            />
          </div>
          <button
            type="submit"
            :disabled="status === 'loading'"
            class="bg-brand-50 hover:bg-brand-100 focus-visible:ring-brand-50/25 flex h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl px-6 text-sm font-semibold text-white outline-none transition-colors focus-visible:ring-4 disabled:cursor-wait disabled:opacity-60"
          >
            <Icon
              :name="status === 'loading' ? 'lucide:loader-circle' : 'lucide:search'"
              :size="17"
              :class="{ 'animate-spin': status === 'loading' }"
            />
            {{ status === 'loading' ? '正在查询' : '查询授权' }}
          </button>
        </div>

        <p
          v-if="message"
          class="mt-3 flex items-start gap-2 text-sm leading-6"
          :class="status === 'invalid' || status === 'error' ? 'text-error-100' : 'text-default-font/55'"
          role="status"
        >
          <Icon
            :name="status === 'invalid' || status === 'error' ? 'lucide:circle-alert' : 'lucide:info'"
            :size="16"
            class="mt-1 shrink-0"
          />
          <span>{{ message }}</span>
        </p>
      </form>

      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-y-2 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
      >
        <article
          v-if="license"
          class="mt-5 overflow-hidden rounded-3xl border border-neutral-700 bg-neutral-900/70"
        >
          <div class="flex flex-col gap-4 border-b border-neutral-700 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-3">
              <div
                class="flex size-11 shrink-0 items-center justify-center rounded-2xl"
                :class="license.active ? 'bg-success-0 text-success-200' : 'bg-error-0 text-error-200'"
              >
                <Icon :name="license.active ? 'lucide:shield-check' : 'lucide:shield-x'" :size="22" />
              </div>
              <div>
                <p class="text-default-font/45 text-xs">查询结果</p>
                <h2 class="mt-0.5 text-xl font-semibold">
                  {{ license.active ? '授权有效' : '授权已失效' }}
                </h2>
              </div>
            </div>
            <span
              class="w-fit rounded-full px-3 py-1 text-xs font-semibold"
              :class="license.active ? 'bg-success-0 text-success-300' : 'bg-error-0 text-error-300'"
            >
              {{ license.active ? 'ACTIVE' : 'INACTIVE' }}
            </span>
          </div>

          <dl class="grid sm:grid-cols-2">
            <div class="border-b border-neutral-700 p-6 sm:border-r">
              <dt class="text-default-font/45 flex items-center gap-2 text-xs">
                <Icon name="lucide:package-check" :size="15" />
                授权套餐
              </dt>
              <dd class="mt-2 font-semibold">{{ license.plan }}</dd>
            </div>
            <div class="border-b border-neutral-700 p-6">
              <dt class="text-default-font/45 flex items-center gap-2 text-xs">
                <Icon name="lucide:clock-3" :size="15" />
                授权时长
              </dt>
              <dd class="mt-2 font-semibold">{{ license.duration }}</dd>
            </div>
            <div class="border-b border-neutral-700 p-6 sm:border-r sm:border-b-0">
              <dt class="text-default-font/45 flex items-center gap-2 text-xs">
                <Icon name="lucide:calendar-clock" :size="15" />
                到期时间
              </dt>
              <dd class="mt-2 font-semibold">{{ license.expiresAt || '永久有效' }}</dd>
            </div>
            <div class="p-6">
              <dt class="text-default-font/45 flex items-center gap-2 text-xs">
                <Icon name="lucide:server" :size="15" />
                绑定面板
              </dt>
              <dd class="mt-2 truncate font-mono text-sm" :title="license.target">
                {{ license.target }}
              </dd>
            </div>
          </dl>
        </article>
      </Transition>
    </section>

    <section class="mx-auto mt-8 max-w-3xl border-y border-neutral-700">
      <div class="grid sm:grid-cols-2 sm:divide-x sm:divide-neutral-700">
        <NuxtLink
          to="/app/license#bind-license"
          class="group flex min-h-28 items-center justify-between gap-4 border-b border-neutral-700 px-4 py-5 transition-colors hover:bg-neutral-900/60 sm:border-b-0 sm:px-6"
        >
          <div class="flex items-center gap-4">
            <span class="bg-brand-700 text-brand-100 flex size-10 shrink-0 items-center justify-center rounded-lg">
              <Icon name="lucide:link" :size="20" />
            </span>
            <div>
              <h2 class="font-semibold">绑定授权</h2>
              <p class="text-default-font/45 mt-1 text-sm leading-6">
                使用兑换码绑定面板域名或 IP
              </p>
            </div>
          </div>
          <Icon name="lucide:arrow-right" :size="18" class="text-default-font/35 shrink-0 transition-transform group-hover:translate-x-1" />
        </NuxtLink>

        <NuxtLink
          to="/app/license#reset-license"
          class="group flex min-h-28 items-center justify-between gap-4 px-4 py-5 transition-colors hover:bg-neutral-900/60 sm:px-6"
        >
          <div class="flex items-center gap-4">
            <span class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-error-0 text-error-200">
              <Icon name="lucide:refresh-cw" :size="20" />
            </span>
            <div>
              <h2 class="font-semibold">重置授权</h2>
              <p class="text-default-font/45 mt-1 text-sm leading-6">
                解除当前绑定后重新绑定新面板
              </p>
            </div>
          </div>
          <Icon name="lucide:arrow-right" :size="18" class="text-default-font/35 shrink-0 transition-transform group-hover:translate-x-1" />
        </NuxtLink>
      </div>
      <p class="text-default-font/40 border-t border-neutral-700 px-4 py-3 text-xs leading-5 sm:px-6">
        绑定和重置需要登录已验证的 Falixer 账户。重置时须提供原兑换码、绑定邮箱和当前面板地址。
      </p>
    </section>

    <section class="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
      <div class="rounded-2xl border border-neutral-700 bg-neutral-900/45 p-5">
        <Icon name="lucide:user-round-check" :size="20" class="text-brand-50" />
        <h2 class="mt-3 font-semibold">个人免费版可查询</h2>
        <p class="text-default-font/45 mt-1 text-sm leading-6">
          免费授权与商业授权使用相同查询入口，无需登录账号。
        </p>
      </div>
      <div class="rounded-2xl border border-neutral-700 bg-neutral-900/45 p-5">
        <Icon name="lucide:scan-search" :size="20" class="text-brand-50" />
        <h2 class="mt-3 font-semibold">仅展示公开信息</h2>
        <p class="text-default-font/45 mt-1 text-sm leading-6">
          查询结果不展示授权密钥、账户资料或其他敏感信息。
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
type LookupStatus = 'idle' | 'loading' | 'invalid' | 'error' | 'success'

interface LicenseLookupResponse {
  active: boolean
  plan: string
  duration: string
  expiresAt: string | null
  target: string
}

const config = useRuntimeConfig()
const query = ref('')
const status = ref<LookupStatus>('idle')
const message = ref('')
const license = ref<LicenseLookupResponse | null>(null)

const normalizeTarget = (value: string) => {
  const raw = value.trim()
  if (!raw) return null

  try {
    const url = new URL(raw.includes('://') ? raw : `https://${raw}`)
    if (!['http:', 'https:'].includes(url.protocol)) return null
    if (url.username || url.password || url.port || url.pathname !== '/' || url.search || url.hash) return null

    const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, '').replace(/\.$/, '')
    const isIpv4 = hostname.split('.').length === 4 && hostname.split('.').every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255)
    const isIpv6 = hostname.includes(':') && /^[0-9a-f:]+$/i.test(hostname)
    const isDomain = hostname.includes('.') && hostname.split('.').every((part) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(part))

    return isIpv4 || isIpv6 || isDomain ? hostname : null
  } catch {
    return null
  }
}

const lookupLicense = async () => {
  license.value = null
  message.value = ''

  const target = normalizeTarget(query.value)
  if (!target) {
    status.value = 'invalid'
    message.value = '请输入有效的面板域名或 IP，不要包含端口、路径或查询参数。'
    return
  }

  const apiBase = String(config.public.licenseApiBase || '').replace(/\/$/, '')
  if (!apiBase) {
    status.value = 'error'
    message.value = '授权查询服务尚未接入。页面已准备完成，配置授权站 API 后即可查询真实数据。'
    return
  }

  status.value = 'loading'
  try {
    license.value = await $fetch<LicenseLookupResponse>(`${apiBase}/query`, {
      method: 'GET',
      query: { target },
    })
    status.value = 'success'
  } catch (error: unknown) {
    status.value = 'error'
    const fetchError = error as { status?: number }
    message.value = fetchError.status === 404
      ? '未找到与该面板域名或 IP 绑定的授权。'
      : '授权服务暂时不可用，请稍后重试。'
  }
}

useSeoMeta({
  title: 'Falixer 授权查询',
  description: '根据绑定的面板域名或 IP 查询 Falixer 套餐、授权状态及授权时长，支持个人免费版。',
  ogTitle: 'Falixer 授权查询',
  ogDescription: '查询 Falixer 授权套餐、状态和有效期。',
})

defineOgImageComponent('Large', {
  title: 'Falixer 授权查询',
})
</script>
