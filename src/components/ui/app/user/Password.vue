<template>
  <div
    class="grid grid-cols-1 divide-neutral-700 overflow-hidden rounded-3xl border border-neutral-700 md:grid-cols-2 md:divide-x"
  >
    <div class="divide-y divide-neutral-700">
      <div class="space-y-2 p-4">
        <h2>密码安全</h2>
        <p>
          定期更新账户密码可提升安全性。
          <NuxtLink to="/auth/forgot" class="text-link">忘记密码？</NuxtLink>
        </p>
      </div>
      <div class="bg-stripes hidden h-full md:block" />
    </div>
    <form @submit.prevent="changePassword" class="divide-y divide-neutral-700">
      <div class="space-y-4 p-4">
        <ElementsFormInput
          v-model="passwordForm.password"
          label="当前密码"
          description="你目前用于登录的密码。"
          name="password"
          type="password"
          :rules="[validationRules.required()]"
          :required="true"
          leading-icon="memory:key"
          autocomplete="current-password"
          placeholder="当前密码"
          :disabled="loading"
          @validate="
            (isValid: boolean) => handleFieldValidation('password', isValid)
          "
        />
        <div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <ElementsFormInput
            v-model="passwordForm.new_password"
            label="新密码"
            name="password"
            type="password"
            :rules="[validationRules.password(), validationRules.required()]"
            :required="true"
            leading-icon="memory:key"
            autocomplete="new-password"
            placeholder="新密码"
            :disabled="loading"
            @validate="
              (isValid: boolean) =>
                handleFieldValidation('new_password', isValid)
            "
          />
          <ElementsFormInput
            v-model="passwordForm.confirm_password"
            label="确认新密码"
            name="password"
            type="password"
            :rules="[
              validationRules.exact(
                passwordForm.new_password,
                '两次输入的密码必须一致'
              ),
              validationRules.password(),
              validationRules.required(),
            ]"
            :required="true"
            leading-icon="memory:rotate-counterclockwise"
            autocomplete="new-password"
            placeholder="再次输入新密码"
            :disabled="loading"
            @validate="
              (isValid: boolean) =>
                handleFieldValidation('confirm_password', isValid)
            "
          />
        </div>
      </div>
      <div>
        <button
          :disabled="
            fieldValidation.password == false ||
            fieldValidation.new_password == false ||
            fieldValidation.confirm_password == false ||
            passwordForm.password == '' ||
            passwordForm.new_password == '' ||
            passwordForm.confirm_password == '' ||
            loading
          "
          type="button"
          @click="passwordModalOpen = true"
          class="disabled:text-default-font/40 hover:not-disabled:text-brand-50 hover:not-disabled:bg-neutral-900 flex w-full cursor-pointer items-center justify-between p-4 py-3 transition-colors disabled:cursor-not-allowed"
        >
          <span class="text-xl font-semibold">更新密码</span>
          <Icon name="memory:chevron-right" mode="svg" :size="24" />
        </button>
        <button type="submit" class="hidden" ref="submitButton" />
      </div>

      <ElementsModal
        :is-open="passwordModalOpen"
        title="确认修改密码"
        @close="passwordModalOpen = false"
      >
        <div class="mb-4">确定要修改密码吗？修改后请使用新密码登录。</div>

        <ElementsBlurredcredential :content="passwordForm.new_password" />

        <template #footer>
          <ElementsButton
            label="取消"
            class="w-full md:w-auto"
            @click="passwordModalOpen = false"
          />
          <ElementsButton
            label="确认修改"
            type="submit"
            class="order-first w-full md:order-[unset] md:w-auto"
            @click="submitButton?.click()"
          />
        </template>
      </ElementsModal>
    </form>
  </div>
</template>

<script setup lang="ts">
const { rules: validationRules } = useFormValidation()

const submitButton = useTemplateRef('submitButton')
const passwordModalOpen = ref(false)
const loading = ref(false)
const errors = ref()
const fieldValidation = ref<Record<string, boolean>>({})
const passwordForm = ref({
  password: '',
  new_password: '',
  confirm_password: '',
})

const handleFieldValidation = (field: string, isValid: boolean) => {
  fieldValidation.value[field] = isValid
}

const changePassword = async () => {
  passwordModalOpen.value = false
  loading.value = true

  try {
    await $fetch('/api/user/password', {
      method: 'PUT',
      body: {
        password: passwordForm.value.password,
        new_password: passwordForm.value.new_password,
      },
    })
  } catch (error) {
    console.error(error)
    errors.value = error
  } finally {
    loading.value = false
    passwordForm.value = {
      password: '',
      new_password: '',
      confirm_password: '',
    }
  }
}
</script>
