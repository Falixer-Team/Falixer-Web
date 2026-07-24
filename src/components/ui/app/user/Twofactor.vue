<template>
  <div class="flex flex-col items-center justify-center bg-neutral-950 p-4">
    <ElementsInlinecard v-if="error == 'enable-error'" class="mb-4">
      无法初始化双重验证，请稍后重试。
    </ElementsInlinecard>
    <div class="flex flex-col items-center py-4">
      <template v-if="user?.totp_enabled">
        <Icon name="pixelarticons:lock" :size="32" mode="svg" />
        <br />
        <p class="max-w-100 chrome:-mt-3 my-3 text-center">
          双重验证已启用，你的账户获得了额外保护。
        </p>
        <ElementsButton
          @click="modalOpen.disable_2fa = true"
          color="danger"
          label="关闭双重验证"
          :disabled="loading"
        />
      </template>
      <template v-else>
        <Icon name="pixelarticons:lock-open" :size="32" mode="svg" />
        <br />
        <p class="max-w-100 my-3 text-center">
          你尚未启用双重验证。建议立即设置，以提高账户安全性。
        </p>
        <ElementsButton
          @click="handleEnable"
          label="启用双重验证"
          :disabled="loading"
        />
      </template>
    </div>
  </div>

  <ElementsModal
    :is-open="modalOpen.enable_2fa"
    :closable="false"
    title="设置双重验证"
    @close="modalOpen.enable_2fa = false"
  >
    <template #default>
      <div
        class="flex flex-col gap-4 overflow-hidden md:flex-row md:items-center"
      >
        <div>
          <div class="inline-block rounded-2xl bg-white p-2">
            <ElementsQrcode
              v-if="enableOtpData?.otp_url"
              :value="enableOtpData.otp_url"
              :size="160"
            />
          </div>
        </div>
        <div class="space-y-2">
          <p>使用身份验证器应用<b>扫描二维码</b>，或手动输入下方密钥。</p>
          <div class="rounded-2xl border border-neutral-700 p-2 font-mono">
            <span class="wrap-anywhere text-wrap">
              {{ enableOtpData?.secret }}
            </span>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <ElementsButton
        label="取消"
        color="danger"
        class="w-full md:w-auto"
        @click="modalOpen.enable_2fa = false"
      />
      <ElementsButton
        label="继续"
        class="order-first w-full md:order-[unset] md:w-auto"
        @click="
          () => {
            modalOpen.enable_2fa = false
            modalOpen.confirm_2fa = true
          }
        "
      />
    </template>
  </ElementsModal>

  <ElementsModal
    :is-open="modalOpen.confirm_2fa"
    :closable="false"
    title="确认双重验证"
    @close="
      () => {
        modalOpen.confirm_2fa = false
        modalOpen.enable_2fa = true
      }
    "
  >
    <template #default>
      <div class="space-y-4">
        <ElementsInlinecard v-if="error == 'confirm-error'">
          验证失败，请检查账户密码和动态验证码。
        </ElementsInlinecard>

        <p>输入身份验证器生成的动态验证码和账户密码以完成设置。</p>

        <ElementsFormInput
          v-model="form.code"
          name="code"
          type="text"
          :rules="[validationRules.required(), validationRules.code()]"
          :required="true"
          leading-icon="memory:shield"
          autocomplete="one-time-code"
          placeholder="6 位动态验证码"
          :disabled="loading"
          @validate="
            (isValid: boolean) => handleFieldValidation('code', isValid)
          "
        />

        <ElementsFormInput
          v-model="form.password"
          name="password"
          type="password"
          :rules="[validationRules.required()]"
          :required="true"
          leading-icon="memory:key"
          autocomplete="current-password"
          placeholder="账户密码"
          :disabled="loading"
          @validate="
            (isValid: boolean) => handleFieldValidation('password', isValid)
          "
        />
      </div>
    </template>

    <template #footer>
      <ElementsButton
        label="返回"
        class="w-full md:w-auto"
        @click="
          () => {
            modalOpen.confirm_2fa = false
            modalOpen.enable_2fa = true
          }
        "
      />
      <ElementsButton
        :disabled="
          fieldValidation.code == false ||
          fieldValidation.password == false ||
          loading
        "
        label="确认启用"
        class="order-first w-full md:order-[unset] md:w-auto"
        @click="handleConfirm"
      />
    </template>
  </ElementsModal>

  <ElementsModal
    :is-open="modalOpen.recovery_codes"
    title="恢复代码"
    @close="modalOpen.recovery_codes = false"
  >
    <template #default>
      <div class="space-y-4">
        <p>
          双重验证已启用。请将恢复代码保存在安全位置；身份验证器不可用时可使用它们登录。
        </p>

        <div class="rounded-2xl border border-neutral-700 p-2 font-mono">
          <span class="text-wrap">
            {{ confirmOtpData?.recovery_codes.join(' ') }}
          </span>
        </div>
      </div>
    </template>

    <template #footer>
      <ElementsButton
        label="关闭"
        class="w-full md:w-auto"
        @click="modalOpen.recovery_codes = false"
      />
      <ElementsButton
        label="下载恢复代码"
        class="order-first w-full md:order-[unset] md:w-auto"
        @click="handleDownloadRecoveryCodes"
      />
    </template>
  </ElementsModal>

  <ElementsModal
    :is-open="modalOpen.disable_2fa"
    title="关闭双重验证"
    @close="modalOpen.disable_2fa = false"
  >
    <template #default>
      <div class="space-y-4">
        <ElementsInlinecard v-if="error == 'disable-error'">
          验证失败，请检查账户密码和动态验证码。
        </ElementsInlinecard>

        <p>关闭双重验证会降低账户安全性，建议保持启用。</p>

        <ElementsFormInput
          v-model="form.code"
          name="code"
          type="text"
          :rules="[validationRules.required(), validationRules.code()]"
          :required="true"
          leading-icon="memory:shield"
          autocomplete="one-time-code"
          placeholder="6 位动态验证码"
          :disabled="loading"
          @validate="
            (isValid: boolean) => handleFieldValidation('code', isValid)
          "
        />

        <ElementsFormInput
          v-model="form.password"
          name="password"
          type="password"
          :rules="[validationRules.required()]"
          :required="true"
          leading-icon="memory:key"
          autocomplete="current-password"
          placeholder="账户密码"
          :disabled="loading"
          @validate="
            (isValid: boolean) => handleFieldValidation('password', isValid)
          "
        />
      </div>
    </template>

    <template #footer>
      <ElementsButton
        label="取消"
        class="w-full md:w-auto"
        @click="modalOpen.disable_2fa = false"
      />
      <ElementsButton
        :disabled="
          fieldValidation.code == false ||
          fieldValidation.password == false ||
          loading
        "
        label="确认关闭"
        color="danger"
        class="order-first w-full md:order-[unset] md:w-auto"
        @click="handleDisable"
      />
    </template>
  </ElementsModal>
</template>

<script setup lang="ts">
import { saveAs } from 'file-saver'

const { user, initializeAuth } = useAuth()
const { rules: validationRules } = useFormValidation()

const loading = ref(false)
const error = ref()
const fieldValidation = ref<Record<string, boolean>>({})
const modalOpen = ref({
  enable_2fa: false,
  confirm_2fa: false,
  recovery_codes: false,
  disable_2fa: false,
})
const form = ref({
  password: '',
  code: '',
})
const enableOtpData = ref<{
  otp_url: string
  secret: string
}>()
const confirmOtpData = ref<{
  recovery_codes: string[]
}>()

const handleFieldValidation = (field: string, isValid: boolean) => {
  fieldValidation.value[field] = isValid
}

const handleEnable = async () => {
  loading.value = true
  error.value = ''
  try {
    enableOtpData.value = await $fetch(`/api/user/two-factor`, {
      method: 'GET',
    })
    modalOpen.value.enable_2fa = true
  } catch {
    error.value = 'enable-error'
    console.error('无法获取双重验证数据，请稍后重试。')
  } finally {
    loading.value = false
  }
}

const handleConfirm = async () => {
  loading.value = true
  error.value = ''
  try {
    confirmOtpData.value = await $fetch(`/api/user/two-factor`, {
      method: 'POST',
      body: form.value,
    })
    await initializeAuth()
    modalOpen.value.confirm_2fa = false
    modalOpen.value.recovery_codes = true
    form.value = { password: '', code: '' }
  } catch {
    error.value = 'confirm-error'
    console.error('无法启用双重验证，请稍后重试。')
  } finally {
    loading.value = false
  }
}

const handleDisable = async () => {
  loading.value = true
  error.value = ''
  try {
    confirmOtpData.value = await $fetch(`/api/user/two-factor`, {
      method: 'DELETE',
      body: form.value,
    })
    await initializeAuth()
    modalOpen.value.disable_2fa = false
    form.value = { password: '', code: '' }
  } catch {
    error.value = 'disable-error'
    console.error('无法关闭双重验证，请稍后重试。')
  } finally {
    loading.value = false
  }
}

const handleDownloadRecoveryCodes = async () => {
  const blob = new Blob(
    [
      `Falixer 双重验证恢复代码，请妥善保存。\n\n${confirmOtpData.value?.recovery_codes.join('\n')}`,
    ],
    { type: 'text/plain;charset=utf-8' }
  )
  saveAs(blob, 'falixer-双重验证恢复代码.txt')
}
</script>
