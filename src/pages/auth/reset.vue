<template>
  <form
    @submit.prevent="handleForgot"
    class="w-full divide-y divide-neutral-700 border-y border-neutral-700"
  >
    <div class="p-4">
      <h1 class="text-4xl!">设置新密码</h1>
    </div>
    <div class="space-y-4 p-4">
      <ElementsInlinecard v-if="error">
        重置链接可能已失效，请
        <NuxtLink to="/auth/forgot" class="text-link">重新获取</NuxtLink>.
      </ElementsInlinecard>

      <ElementsFormInput
        v-model="form.new_password"
        name="password"
        type="password"
        :rules="[validationRules.password(), validationRules.required()]"
        :required="true"
        leading-icon="memory:key"
        autocomplete="new-password"
        placeholder="新密码"
        :disabled="loading"
        @validate="
          (isValid: boolean) => handleFieldValidation('new_password', isValid)
        "
      />
      <ElementsFormInput
        v-model="form.confirm_password"
        name="password"
        type="password"
        :rules="[
          validationRules.exact(form.new_password, '两次输入的密码必须一致'),
          validationRules.password(),
          validationRules.required(),
        ]"
        :required="true"
        leading-icon="memory:rotate-counterclockwise"
        autocomplete="new-password"
        placeholder="确认新密码"
        :disabled="loading"
        @validate="
          (isValid: boolean) =>
            handleFieldValidation('confirm_password', isValid)
        "
      />

      <span class="text-default-font/50"> 输入并确认新密码以完成修改。 </span>
    </div>
    <button
      :disabled="
        fieldValidation.new_password == false ||
        fieldValidation.confirm_password == false ||
        loading
      "
      type="submit"
      class="text-default-font hover:text-brand-50 focus:text-brand-50 flex w-full cursor-pointer items-center justify-between bg-neutral-950 px-4 py-3 outline-0 transition-colors hover:bg-neutral-900 focus:bg-neutral-900"
      @mousedown.prevent="handleForgot"
    >
      <span class="text-xl font-semibold">修改密码</span>
      <Icon name="memory:chevron-right" mode="svg" :size="24" />
    </button>
  </form>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const route = useRoute()
const { rules: validationRules } = useFormValidation()

onMounted(async () => {
  if (!route.query.token || route.query.token.length != 96) {
    await navigateTo('/auth/forgot')
  }
})

const loading = ref(false)
const error = ref(false)
const fieldValidation = ref<Record<string, boolean>>({})
const form = ref({
  new_password: '',
  confirm_password: '',
})

const handleFieldValidation = (field: string, isValid: boolean) => {
  fieldValidation.value[field] = isValid
}

const handleForgot = async () => {
  loading.value = true
  error.value = false

  try {
    await $fetch('/api/auth/password/reset', {
      method: 'POST',
      body: {
        new_password: form.value.new_password,
        token: route.query.token,
      },
    })
    await navigateTo('/auth?reset=true')
  } catch {
    error.value = true
  }
  loading.value = false
}
</script>
