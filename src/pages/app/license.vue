<template>
  <div class="space-y-5">
    <div>
      <p class="text-brand-50 font-mono text-xs uppercase tracking-[0.16em]">
        License center
      </p>
      <h1 class="mt-2 text-3xl font-semibold tracking-tight">授权中心</h1>
      <p class="text-default-font/55 mt-2 max-w-2xl leading-7">
        使用兑换码将授权绑定到面板域名或 IP，也可以通过原兑换码解除当前绑定。
      </p>
    </div>

    <div class="grid gap-5 lg:grid-cols-2">
      <form
        class="flex flex-col rounded-3xl border border-neutral-700 bg-neutral-950 p-5 md:p-7"
        @submit.prevent="redeem"
      >
        <div class="flex items-center gap-3">
          <div class="bg-brand-700 text-brand-100 flex size-11 items-center justify-center rounded-2xl">
            <Icon name="lucide:key-round" :size="22" />
          </div>
          <div>
            <h2 class="text-xl font-semibold">兑换并绑定</h2>
            <p class="text-default-font/45 mt-0.5 text-sm">一个兑换码只能绑定一个面板</p>
          </div>
        </div>

        <div class="mt-6 space-y-5">
          <ElementsFormInput
            v-model="redeemForm.code"
            name="redeem-code"
            label="兑换码"
            placeholder="FLX-XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX"
            description="输入完整的 Falixer 授权兑换码。"
            leading-icon="lucide:key-round"
            autocomplete="off"
            required
            :disabled="redeemLoading"
          />
          <ElementsFormInput
            v-model="redeemForm.email"
            name="redeem-email"
            type="email"
            label="使用者邮箱"
            placeholder="owner@example.com"
            description="用于授权归属追溯，不会在公开查询中展示。"
            leading-icon="lucide:mail"
            autocomplete="email"
            required
            :disabled="redeemLoading"
          />
          <ElementsFormInput
            v-model="redeemForm.target"
            name="redeem-target"
            label="面板域名或 IP"
            placeholder="panel.example.com"
            description="不要包含端口、路径或查询参数。"
            leading-icon="lucide:server"
            autocomplete="url"
            required
            :disabled="redeemLoading"
          />
        </div>

        <div
          v-if="redeemMessage"
          class="mt-5 flex items-start gap-2 rounded-2xl border p-3 text-sm leading-6"
          :class="redeemSuccess ? 'border-success-700 bg-success-0 text-success-300' : 'border-error-700 bg-error-0 text-error-300'"
          role="status"
        >
          <Icon :name="redeemSuccess ? 'lucide:circle-check' : 'lucide:circle-alert'" :size="17" class="mt-0.5 shrink-0" />
          <span>{{ redeemMessage }}</span>
        </div>

        <button
          type="submit"
          :disabled="redeemLoading"
          class="bg-brand-50 hover:bg-brand-100 focus-visible:ring-brand-50/25 mt-6 flex h-11 cursor-pointer items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold text-white outline-none transition focus-visible:ring-4 disabled:cursor-wait disabled:opacity-60"
        >
          <Icon :name="redeemLoading ? 'lucide:loader-circle' : 'lucide:link'" :size="17" :class="{ 'animate-spin': redeemLoading }" />
          {{ redeemLoading ? '正在绑定' : '兑换并绑定' }}
        </button>
      </form>

      <form
        class="flex flex-col rounded-3xl border border-neutral-700 bg-neutral-950 p-5 md:p-7"
        @submit.prevent="unbind"
      >
        <div class="flex items-center gap-3">
          <div class="bg-error-0 text-error-200 flex size-11 items-center justify-center rounded-2xl">
            <Icon name="lucide:unlink" :size="22" />
          </div>
          <div>
            <h2 class="text-xl font-semibold">解除绑定</h2>
            <p class="text-default-font/45 mt-0.5 text-sm">解绑后兑换码可以重新绑定其他面板</p>
          </div>
        </div>

        <div class="mt-6 space-y-5">
          <ElementsFormInput
            v-model="unbindForm.code"
            name="unbind-code"
            label="原兑换码"
            placeholder="FLX-XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX"
            description="必须与创建当前授权时使用的兑换码一致。"
            leading-icon="lucide:key-round"
            autocomplete="off"
            required
            :disabled="unbindLoading"
          />
          <ElementsFormInput
            v-model="unbindForm.email"
            name="unbind-email"
            type="email"
            label="使用者邮箱"
            placeholder="owner@example.com"
            description="必须与当前授权绑定的邮箱一致。"
            leading-icon="lucide:mail"
            autocomplete="email"
            required
            :disabled="unbindLoading"
          />
          <ElementsFormInput
            v-model="unbindForm.target"
            name="unbind-target"
            label="当前绑定域名或 IP"
            placeholder="panel.example.com"
            description="必须与当前授权绑定目标完全一致。"
            leading-icon="lucide:server"
            autocomplete="url"
            required
            :disabled="unbindLoading"
          />
        </div>

        <div
          v-if="unbindMessage"
          class="mt-5 flex items-start gap-2 rounded-2xl border p-3 text-sm leading-6"
          :class="unbindSuccess ? 'border-success-700 bg-success-0 text-success-300' : 'border-error-700 bg-error-0 text-error-300'"
          role="status"
        >
          <Icon :name="unbindSuccess ? 'lucide:circle-check' : 'lucide:circle-alert'" :size="17" class="mt-0.5 shrink-0" />
          <span>{{ unbindMessage }}</span>
        </div>

        <button
          type="submit"
          :disabled="unbindLoading"
          class="focus-visible:ring-error-50/20 mt-6 flex h-11 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-error-700 bg-error-0 px-5 text-sm font-semibold text-error-200 outline-none transition hover:bg-error-800 hover:text-error-50 focus-visible:ring-4 disabled:cursor-wait disabled:opacity-60"
        >
          <Icon :name="unbindLoading ? 'lucide:loader-circle' : 'lucide:unlink'" :size="17" :class="{ 'animate-spin': unbindLoading }" />
          {{ unbindLoading ? '正在解绑' : '确认解除绑定' }}
        </button>
      </form>
    </div>

    <div class="rounded-2xl border border-warning-700 bg-warning-0 p-4 text-sm text-warning-500">
      <div class="flex items-start gap-2">
        <Icon name="lucide:triangle-alert" :size="17" class="mt-0.5 shrink-0" />
        <p class="leading-6">
          解绑会立即删除当前面板授权，但保留邮箱、目标和操作时间的审计记录。请妥善保存兑换码，任何索要兑换码或账户密码的人员都可能是诈骗者。
        </p>
      </div>
    </div>

    <NuxtLink
      to="/license"
      class="hover:border-brand-50 hover:text-brand-50 flex items-center justify-between gap-4 rounded-2xl border border-neutral-700 bg-neutral-950 p-4 transition-colors"
    >
      <div class="flex items-center gap-3">
        <Icon name="lucide:scan-search" :size="20" class="text-brand-50 shrink-0" />
        <div>
          <p class="font-semibold">查询授权状态</p>
          <p class="text-default-font/45 mt-1 text-sm">根据面板域名或 IP 查询套餐、状态和授权时长，不展示邮箱。</p>
        </div>
      </div>
      <Icon name="lucide:arrow-right" :size="18" class="shrink-0" />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
interface LicenseActionError {
  status?: number
  statusCode?: number
  data?: { error?: string }
  response?: { status?: number; _data?: { error?: string } }
}

const config = useRuntimeConfig()
const { user } = useAuth()
const apiBase = computed(() => String(config.public.licenseApiBase || '').replace(/\/$/, ''))

const redeemForm = reactive({ code: '', email: user.value?.email || '', target: '' })
const unbindForm = reactive({ code: '', email: user.value?.email || '', target: '' })
const redeemLoading = ref(false)
const unbindLoading = ref(false)
const redeemMessage = ref('')
const unbindMessage = ref('')
const redeemSuccess = ref(false)
const unbindSuccess = ref(false)

const errorMessage = (error: unknown, fallback: string) => {
  const value = error as LicenseActionError
  const status = value.status ?? value.statusCode ?? value.response?.status
  const detail = value.data?.error ?? value.response?._data?.error
  if (status === 404) return '兑换码或绑定信息不匹配。'
  if (status === 409) return detail?.includes('already') ? '该兑换码或面板已经被绑定。' : '绑定状态已发生变化，请刷新后重试。'
  if (status === 410) return '该兑换码已撤销或已过期。'
  return detail || fallback
}

const redeem = async () => {
  redeemMessage.value = ''
  redeemSuccess.value = false
  redeemLoading.value = true
  try {
    const result = await $fetch<{ license: { target: string; plan: string; duration: string } }>(`${apiBase.value}/redeem`, {
      method: 'POST',
      body: {
        code: redeemForm.code.trim(),
        userEmail: redeemForm.email.trim(),
        target: redeemForm.target.trim(),
      },
    })
    redeemSuccess.value = true
    redeemMessage.value = `绑定成功：${result.license.plan}（${result.license.duration}），面板 ${result.license.target}`
    redeemForm.code = ''
    redeemForm.target = ''
  } catch (error) {
    redeemMessage.value = errorMessage(error, '授权服务暂时不可用，请稍后重试。')
  } finally {
    redeemLoading.value = false
  }
}

const unbind = async () => {
  unbindMessage.value = ''
  unbindSuccess.value = false
  unbindLoading.value = true
  try {
    const result = await $fetch<{ unbound: boolean; target: string }>(`${apiBase.value}/unbind`, {
      method: 'POST',
      body: {
        code: unbindForm.code.trim(),
        userEmail: unbindForm.email.trim(),
        target: unbindForm.target.trim(),
      },
    })
    unbindSuccess.value = result.unbound
    unbindMessage.value = `已解除 ${result.target} 的授权绑定，兑换码现在可以重新使用。`
    unbindForm.code = ''
    unbindForm.target = ''
  } catch (error) {
    unbindMessage.value = errorMessage(error, '解绑失败，请核对兑换码、邮箱和当前绑定目标。')
  } finally {
    unbindLoading.value = false
  }
}

definePageMeta({
  middleware: 'user-verified',
  layout: 'dashboard',
})

useSeoMeta({
  title: 'Falixer 授权中心',
  description: '兑换 Falixer 授权码并管理面板绑定。',
})
</script>
