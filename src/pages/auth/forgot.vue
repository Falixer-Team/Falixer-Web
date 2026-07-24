<template>
  <form
    v-if="!success"
    @submit.prevent="handleForgot"
    class="w-full divide-y divide-neutral-700 border-y border-neutral-700"
  >
    <div class="p-4">
      <h1 class="text-4xl!">找回密码</h1>
    </div>
    <div class="space-y-4 p-4">
      <ElementsInlinecard v-if="error">
        {{ errorMessage || '发生未知错误，请稍后重试。' }}
      </ElementsInlinecard>
      <ElementsFormInput
        v-model="form.email"
        name="email"
        type="email"
        :rules="[validationRules.required(), validationRules.email()]"
        :required="true"
        leading-icon="memory:email"
        autocomplete="email"
        placeholder="邮箱地址"
        @validate="
          (isValid: boolean) => handleFieldValidation('email', isValid)
        "
      />
      <div class="grid grid-cols-[1fr_auto] items-start gap-2">
        <ElementsFormInput
          v-model="form.code"
          name="email-code"
          type="text"
          :rules="[validationRules.required(), validationRules.code()]"
          :required="true"
          leading-icon="memory:shield"
          autocomplete="one-time-code"
          placeholder="6 位邮箱验证码"
          :disabled="loading"
          @validate="
            (isValid: boolean) => handleFieldValidation('code', isValid)
          "
        />
        <button
          type="button"
          :disabled="loading || countdown > 0 || !form.email"
          class="hover:text-brand-50 h-11 rounded-xl border border-neutral-700 bg-neutral-900 px-4 transition-colors disabled:opacity-50"
          @click="sendCode"
        >
          {{ countdown > 0 ? `${countdown} 秒` : '获取验证码' }}
        </button>
      </div>

      <span class="text-default-font/50">
        输入账户邮箱并完成验证。验证通过后，我们仍会发送兼容的密码重置链接。
      </span>
    </div>
    <button
      :disabled="
        fieldValidation.email == false ||
        fieldValidation.code == false ||
        loading
      "
      type="submit"
      class="text-default-font focus:text-brand-50 hover:text-brand-50 flex w-full cursor-pointer items-center justify-between bg-neutral-950 px-4 py-3 outline-0 transition-colors hover:bg-neutral-900 focus:bg-neutral-900"
      @mousedown.prevent="handleForgot"
    >
      <span class="text-xl font-semibold">验证并发送重置链接</span>
      <Icon name="memory:chevron-right" mode="svg" :size="24" />
    </button>
  </form>

  <div
    v-if="success"
    class="w-full divide-y divide-neutral-700 border-y border-neutral-700"
  >
    <div class="p-4">
      <h1 class="text-4xl!">请查收邮件</h1>
    </div>
    <div class="space-y-4 p-4">
      <span class="text-default-font">
        密码重置链接已发送至
        <ProseCode>{{ form.email }}</ProseCode
        >，邮件可能需要几分钟才能送达。
      </span>
    </div>
  </div>

  <ElementsTurnstilemodal
    v-model="turnstileModal.captchaValue.value"
    :is-open="turnstileModal.isOpen.value"
    ref="turnstileRef"
    @close="turnstileModal.close"
  />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const { rules: validationRules } = useFormValidation()

const turnstileModal = useTurnstileModal()
const turnstileRef = useTemplateRef('turnstileRef')

const loading = ref(false)
const error = ref(false)
const errorMessage = ref('')
const success = ref(false)
const countdown = ref(0)
const fieldValidation = ref<Record<string, boolean>>({})
const form = ref({
  email: '',
  code: '',
})

const getErrorMessage = (error: any) =>
  error?.data?.statusMessage || error?.statusMessage || error?.message || ''

const sendCode = async () => {
  loading.value = true
  const result = await turnstileModal.show()
  if (!result.confirmed) {
    loading.value = false
    return
  }
  try {
    const data = await $fetch<{ resendIn: number }>(
      '/_falixer-auth/email-code/send',
      {
        method: 'POST',
        body: {
          email: form.value.email,
          purpose: 'password-reset',
          captcha: turnstileModal.captchaValue.value,
        },
      }
    )
    countdown.value = data.resendIn
    const timer = window.setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) window.clearInterval(timer)
    }, 1000)
  } catch (err) {
    error.value = true
    errorMessage.value = getErrorMessage(err)
  } finally {
    loading.value = false
    turnstileRef.value?.turnstile.reset()
  }
}

const handleFieldValidation = (field: string, isValid: boolean) => {
  fieldValidation.value[field] = isValid
}

const handleForgot = async () => {
  loading.value = true
  error.value = false
  success.value = false

  const result = await turnstileModal.show()
  if (!result.confirmed) {
    turnstileRef.value?.turnstile.reset()
    loading.value = false
    return
  }

  try {
    const verified = await $fetch<{ verificationToken: string }>(
      '/_falixer-auth/email-code/verify',
      {
        method: 'POST',
        body: {
          email: form.value.email,
          purpose: 'password-reset',
          code: form.value.code,
        },
      }
    )
    await $fetch('/_falixer-auth/password-forgot', {
      method: 'POST',
      body: {
        email: form.value.email,
        captcha: turnstileModal.captchaValue.value,
        verification_token: verified.verificationToken,
      },
    })
    error.value = false
    success.value = true
  } catch (err) {
    error.value = true
    errorMessage.value = getErrorMessage(err)
    success.value = false
  }

  turnstileRef.value?.turnstile.reset()
  loading.value = false
}
</script>
