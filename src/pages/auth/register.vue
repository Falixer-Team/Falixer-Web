<template>
  <form
    @submit.prevent="handleRegister"
    class="w-full divide-y divide-neutral-700 border-y border-neutral-700"
  >
    <div class="p-4">
      <h1 class="text-4xl!">创建账户</h1>
    </div>
    <div class="space-y-4 p-4">
      <ElementsInlinecard
        v-if="errors?.includes('user with name or email already exists')"
      >
        邮箱地址或用户名已被使用。
      </ElementsInlinecard>
      <ElementsInlinecard v-else-if="errors?.includes('failed to create user')">
        无法创建账户，请稍后重试。
      </ElementsInlinecard>
      <ElementsInlinecard v-else-if="errors">
        {{ errorMessage || '发生未知错误，请稍后重试。' }}
      </ElementsInlinecard>
      <ElementsInlinecard
        v-if="route.query.reason == 'oauth'"
        class="mb-4 w-full"
      >
        请先创建账户。
      </ElementsInlinecard>
      <ElementsFormInput
        v-model="form.displayName"
        name="displayname"
        type="text"
        :rules="[
          validationRules.required(),
          validationRules.name(),
          validationRules.minLength(3),
          validationRules.maxLength(15),
        ]"
        :required="true"
        leading-icon="memory:user"
        autocomplete="nickname"
        placeholder="显示名称"
        :disabled="loading"
        @validate="
          (isValid: boolean) => handleFieldValidation('displayName', isValid)
        "
      />
      <ElementsFormInput
        v-model="form.email"
        name="email"
        type="email"
        :rules="[validationRules.required(), validationRules.email()]"
        :required="true"
        leading-icon="memory:email"
        autocomplete="email"
        placeholder="邮箱地址"
        :disabled="loading"
        @validate="
          (isValid: boolean) => handleFieldValidation('email', isValid)
        "
      />
      <ElementsFormInput
        v-model="form.password"
        name="password"
        type="password"
        :rules="[validationRules.required(), validationRules.password()]"
        :required="true"
        leading-icon="memory:key"
        autocomplete="new-password"
        placeholder="密码"
        :disabled="loading"
        @validate="
          (isValid: boolean) => handleFieldValidation('password', isValid)
        "
      />
      <div class="grid grid-cols-[1fr_auto] items-start gap-2">
        <ElementsFormInput
          v-model="form.emailCode"
          name="email-code"
          type="text"
          :rules="[validationRules.required(), validationRules.code()]"
          :required="true"
          leading-icon="memory:shield"
          autocomplete="one-time-code"
          placeholder="6 位邮箱验证码"
          :disabled="loading || Boolean(verificationToken)"
          @validate="
            (isValid: boolean) => handleFieldValidation('emailCode', isValid)
          "
        />
        <button
          type="button"
          :disabled="
            loading ||
            countdown > 0 ||
            fieldValidation.email === false ||
            !form.email
          "
          class="hover:text-brand-50 h-11 rounded-xl border border-neutral-700 bg-neutral-900 px-4 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          @click="sendCode"
        >
          {{ countdown > 0 ? `${countdown} 秒` : '获取验证码' }}
        </button>
      </div>
      <p v-if="verificationToken" class="text-sm text-green-400">
        邮箱验证成功
      </p>

      <span class="text-default-font/50">
        创建账户即表示你已阅读并同意我们的
        <!-- prettier-ignore -->
        <NuxtLink to="/legal/terms" class="text-link">服务条款</NuxtLink
        ><span>, </span>
        <!-- prettier-ignore -->
        <NuxtLink to="/legal/privacy" class="text-link">隐私政策</NuxtLink>
        与
        <!-- prettier-ignore -->
        <NuxtLink to="/legal/conduct" class="text-link">行为准则</NuxtLink>
      </span>
    </div>
    <button
      :disabled="
        fieldValidation.displayName == false ||
        fieldValidation.email == false ||
        fieldValidation.password == false ||
        fieldValidation.emailCode == false ||
        !form.emailCode ||
        loading
      "
      type="submit"
      @mousedown.prevent="handleRegister"
      class="text-default-font focus:text-brand-50 hover:text-brand-50 flex w-full cursor-pointer items-center justify-between bg-neutral-950 px-4 py-3 outline-0 transition-colors hover:bg-neutral-900 focus:bg-neutral-900"
    >
      <div class="text-xl font-semibold">
        <span>注册</span>
      </div>
      <Icon name="memory:chevron-right" mode="svg" :size="24" />
    </button>
  </form>

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
  middleware: 'guest',
})

const { register } = useAuth()
const { rules: validationRules } = useFormValidation()
const route = useRoute()

const turnstileModal = useTurnstileModal()
const turnstileRef = useTemplateRef('turnstileRef')

const loading = ref(false)
const errors = ref()
const errorMessage = ref('')
const verificationToken = ref('')
const countdown = ref(0)
const fieldValidation = ref<Record<string, boolean>>({})
const form = ref({
  displayName: '',
  email: '',
  password: '',
  emailCode: '',
})

watch(
  () => form.value.email,
  () => {
    verificationToken.value = ''
    form.value.emailCode = ''
  }
)

const getErrorMessage = (error: any) =>
  error?.data?.statusMessage || error?.statusMessage || error?.message || ''

const sendCode = async () => {
  loading.value = true
  errorMessage.value = ''
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
          purpose: 'register',
          captcha: turnstileModal.captchaValue.value,
        },
      }
    )
    countdown.value = data.resendIn
    const timer = window.setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) window.clearInterval(timer)
    }, 1000)
  } catch (error) {
    errorMessage.value = getErrorMessage(error)
    errors.value = ['email-code-error']
  } finally {
    loading.value = false
    turnstileRef.value?.turnstile.reset()
  }
}

const verifyCode = async () => {
  const data = await $fetch<{ verificationToken: string }>(
    '/_falixer-auth/email-code/verify',
    {
      method: 'POST',
      body: {
        email: form.value.email,
        purpose: 'register',
        code: form.value.emailCode,
      },
    }
  )
  verificationToken.value = data.verificationToken
}

const handleFieldValidation = (field: string, isValid: boolean) => {
  fieldValidation.value[field] = isValid
}

const handleRegister = async () => {
  loading.value = true

  try {
    if (!verificationToken.value) await verifyCode()
  } catch (error) {
    errorMessage.value = getErrorMessage(error)
    errors.value = ['email-code-error']
    loading.value = false
    return
  }

  const result = await turnstileModal.show()
  if (!result.confirmed) {
    turnstileRef.value?.turnstile.reset()
    loading.value = false
    return
  }

  try {
    await register(
      form.value.email,
      form.value.password,
      form.value.displayName,
      turnstileModal.captchaValue.value,
      verificationToken.value
    )
  } catch (error) {
    console.error(error)
    errors.value = error
  } finally {
    loading.value = false
  }

  turnstileRef.value?.turnstile.reset()
}
</script>
