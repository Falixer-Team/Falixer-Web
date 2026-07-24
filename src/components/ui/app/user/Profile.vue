<template>
  <div
    class="grid grid-cols-1 divide-neutral-700 overflow-hidden rounded-3xl border border-neutral-700 md:grid-cols-2 md:divide-x"
  >
    <div class="divide-y divide-neutral-700">
      <div class="space-y-2 p-4">
        <h2>个人资料</h2>
        <p>更新你的 Falixer 账户信息和邮箱地址。</p>
      </div>
      <div class="bg-stripes hidden h-full md:block" />
    </div>
    <form @submit.prevent="updateProfile" class="divide-y divide-neutral-700">
      <div class="grid grid-cols-1 gap-4 p-4 xl:grid-cols-2">
        <ElementsFormInput
          v-model="profileForm.name"
          label="显示名称"
          description="显示在站内和公开主页上的唯一名称。"
          name="name"
          type="text"
          :rules="[
            validationRules.required(),
            validationRules.name(),
            validationRules.minLength(3),
            validationRules.maxLength(15),
          ]"
          :required="true"
          leading-icon="memory:user"
          autocomplete="username"
          placeholder="Byte"
          :disabled="loading"
          @validate="
            (isValid: boolean) => handleFieldValidation('name', isValid)
          "
        />
        <ElementsFormInput
          v-model="profileForm.pronouns"
          label="称谓"
          description="称谓会显示在你的公开个人主页上。"
          name="pronouns"
          type="text"
          :rules="[validationRules.pronouns(), validationRules.maxLength(22)]"
          leading-icon="memory:tag-text"
          placeholder="例如：TA"
          :disabled="loading"
          @validate="
            (isValid: boolean) => handleFieldValidation('pronouns', isValid)
          "
        />
        <ElementsFormInput
          v-model="accountForm.email"
          label="邮箱地址"
          description="与你的 Falixer 账户关联的邮箱地址。修改后需要重新验证。"
          name="email"
          type="email"
          :rules="[validationRules.email(), validationRules.required()]"
          leading-icon="memory:email"
          placeholder="name@example.com"
          :required="true"
          :disabled="loading"
          @validate="
            (isValid: boolean) => handleFieldValidation('email', isValid)
          "
        />
        <ElementsFormInput
          v-model="profileForm.support"
          label="支持链接"
          description="发布扩展后，用户可通过此链接获取支持。"
          name="support"
          type="url"
          :rules="[validationRules.url()]"
          leading-icon="memory:tooltip-start-help"
          placeholder="mailto:example@example.com"
          :disabled="loading"
          @validate="
            (isValid: boolean) => handleFieldValidation('support', isValid)
          "
        />
      </div>
      <button
        :disabled="
          fieldValidation.name == false ||
          fieldValidation.pronouns == false ||
          fieldValidation.email == false ||
          fieldValidation.support == false ||
          loading
        "
        type="submit"
        class="disabled:text-default-font/40 hover:not-disabled:text-brand-50 hover:not-disabled:bg-neutral-900 flex w-full cursor-pointer items-center justify-between p-4 py-3 transition-colors disabled:cursor-not-allowed"
      >
        <span class="text-xl font-semibold">保存更改</span>
        <Icon name="memory:floppy-disk" mode="svg" :size="24" />
      </button>
    </form>
  </div>

  <ElementsTurnstilemodal
    v-model="turnstileModal.captchaValue.value"
    :is-open="turnstileModal.isOpen.value"
    ref="turnstileRef"
    @close="turnstileModal.close"
  />
</template>

<script setup lang="ts">
const { user, initializeAuth } = useAuth()
const { rules: validationRules } = useFormValidation()

const turnstileModal = useTurnstileModal()
const turnstileRef = useTemplateRef('turnstileRef')

const modalOpen = ref({
  turnstile: false,
})
const loading = ref(false)
const errors = ref({
  profile: [],
  account: [],
})
const fieldValidation = ref<Record<string, boolean>>({})
const profileForm = ref({
  name: user.value?.name || '',
  pronouns: user.value?.pronouns || '',
  support: user.value?.support || '',
})
const accountForm = ref({
  email: user.value?.email || '',
  captcha: '',
})

const handleFieldValidation = (field: string, isValid: boolean) => {
  fieldValidation.value[field] = isValid
}

const updateProfile = async () => {
  loading.value = true

  if (accountForm.value.email != user.value?.email) {
    const result = await turnstileModal.show()
    if (!result.confirmed) {
      turnstileRef.value?.turnstile.reset()
      loading.value = false
      return
    }

    try {
      await $fetch('/api/user/email', {
        method: 'PATCH',
        body: {
          email: accountForm.value.email,
          captcha: turnstileModal.captchaValue.value,
        },
      })
      modalOpen.value.turnstile = false
    } catch (error) {
      console.error(error)
      //@ts-expect-error
      errors.value.account = error
    }

    turnstileRef.value?.turnstile.reset()
  }

  try {
    await $fetch('/api/user', {
      method: 'PATCH',
      body: {
        name: profileForm.value.name || null,
        pronouns: profileForm.value.pronouns || null,
        support: profileForm.value.support || null,
      },
    })
  } catch (error) {
    console.error(error)
    //@ts-expect-error
    errors.value.profile = error
  } finally {
    await initializeAuth()
    loading.value = false
  }
}
</script>
