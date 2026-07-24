<template>
  <form
    @submit.prevent="handleLogin"
    class="w-full divide-y divide-neutral-700 border-y border-neutral-700"
  >
    <div class="p-4">
      <h1 class="text-4xl!">欢迎回来</h1>
    </div>
    <div class="space-y-4 p-4">
      <ElementsInlinecard
        v-if="errors?.includes('invalid username or password')"
      >
        邮箱或密码不正确，请检查输入，或
        <NuxtLink to="/auth/forgot" class="text-link">找回账户</NuxtLink>.
      </ElementsInlinecard>
      <ElementsInlinecard v-else-if="errors">
        请求失败，请稍后重试。
      </ElementsInlinecard>
      <ElementsInlinecard v-if="reset">
        密码已重置，请使用新密码登录。
      </ElementsInlinecard>

      <ElementsFormInput
        v-model="authForm.email"
        name="email"
        type="email"
        :rules="[validationRules.required(), validationRules.email()]"
        :required="true"
        leading-icon="memory:email"
        autocomplete="email"
        placeholder="邮箱地址"
        :disabled="loading || checkpointData.authType == 'two_factor_required'"
        @validate="
          (isValid: boolean) => handleFieldValidation('email', isValid)
        "
      />
      <ElementsFormInput
        v-model="authForm.password"
        name="password"
        type="password"
        :rules="[validationRules.required()]"
        :required="true"
        leading-icon="memory:key"
        autocomplete="current-password"
        placeholder="密码"
        :disabled="loading || checkpointData.authType == 'two_factor_required'"
        @validate="
          (isValid: boolean) => handleFieldValidation('password', isValid)
        "
      />
      <ElementsFormInput
        v-model="checkpointForm.code"
        v-if="checkpointData.authType == 'two_factor_required'"
        name="code"
        type="text"
        :rules="[validationRules.required(), validationRules.code()]"
        :required="true"
        leading-icon="memory:shield"
        autocomplete="one-time-code"
        placeholder="双重验证代码"
        :disabled="loading"
        @validate="(isValid: boolean) => handleFieldValidation('code', isValid)"
      />

      <span
        v-if="checkpointData.authType == 'two_factor_required'"
        class="text-default-font/50"
      >
        输入 6 位动态验证码或恢复代码。
      </span>
      <span v-else class="text-default-font/50">
        忘记密码或无法访问账户？
        <NuxtLink to="/auth/forgot" class="text-link"> 找回账户 </NuxtLink>
      </span>
    </div>
    <div
      class="flex flex-col divide-y divide-neutral-700 md:flex-row md:divide-x md:divide-y-0"
    >
      <button
        :disabled="
          (checkpointData.authType != 'two_factor_required' &&
            (fieldValidation.email == false ||
              fieldValidation.password == false)) ||
          (checkpointData.authType == 'two_factor_required' &&
            fieldValidation.code == false) ||
          loading
        "
        type="submit"
        class="text-default-font focus:text-brand-50 flex w-full cursor-pointer items-center justify-between bg-neutral-950 px-4 py-3 outline-0 transition-colors hover:bg-neutral-900 focus:bg-neutral-900"
        @mousedown.prevent="handleLogin"
      >
        <span class="text-xl font-semibold">继续</span>
        <Icon name="memory:chevron-right" mode="svg" :size="24" />
      </button>
      <NuxtLink
        to="/api/auth/github"
        :external="true"
        tabindex="0"
        class="group outline-0"
      >
        <button
          :disabled="loading"
          type="button"
          tabindex="-1"
          class="text-default-font group-focus:text-brand-50 hover:text-brand-50 w-full cursor-pointer text-nowrap bg-neutral-950 px-4 py-3 text-left text-xl font-semibold transition-colors hover:bg-neutral-900 group-focus:bg-neutral-900 md:w-auto"
          @mousedown.prevent
        >
          使用 GitHub 登录
        </button>
      </NuxtLink>
    </div>
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

const route = useRoute()
const { login, checkpoint, checkpointData } = useAuth()
const { rules: validationRules } = useFormValidation()

const turnstileModal = useTurnstileModal()
const turnstileRef = useTemplateRef('turnstileRef')

const loading = ref(false)
const errors = ref()
const reset = ref(false)
const fieldValidation = ref<Record<string, boolean>>({})
const authForm = ref({
  email: '',
  password: '',
})
const checkpointForm = ref({
  code: '',
})

if (route.query.reset) {
  reset.value = true
}

const handleFieldValidation = (field: string, isValid: boolean) => {
  fieldValidation.value[field] = isValid
}

const handleLogin = async () => {
  loading.value = true

  // [INFO] Two factor authentication
  if (checkpointData.value.authType == 'two_factor_required') {
    try {
      await checkpoint(checkpointForm.value.code)
    } catch (error) {
      console.error(error)
      errors.value = error
    } finally {
      loading.value = false
    }
    return
  }

  const result = await turnstileModal.show()
  if (!result.confirmed) {
    turnstileRef.value?.turnstile.reset()
    loading.value = false
    return
  }

  // [INFO] Sign in like normal
  try {
    await login(
      authForm.value.email,
      authForm.value.password,
      turnstileModal.captchaValue.value
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
