<template>
  <div
    class="min-h-30 flex flex-col items-center justify-between gap-4 rounded-3xl border border-neutral-700 bg-[url(/img/banners.png)] bg-cover bg-right bg-no-repeat p-4 sm:flex-row"
  >
    <div class="w-full space-y-1 sm:w-auto">
      <p class="text-2xl font-bold">下一步我们要构建什么？</p>
      <p class="text-default-font/60">
        将你的下一个扩展发布到 Falixer，让它赢在起跑线。
      </p>
    </div>
    <ElementsButton
      label="新建扩展"
      class="w-full sm:w-auto"
      @click="modalOpen.new = true"
    />
  </div>

  <ElementsModal
    :is-open="modalOpen.new"
    :closable="true"
    title="新建扩展"
    @close="modalOpen.new = false"
  >
    <template #default>
      <div class="space-y-4">
        <ElementsInlinecard v-if="errors">
          发生了意外错误，请稍后重试。
        </ElementsInlinecard>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ElementsFormInput
            v-model="form.name"
            label="名称"
            description="扩展的显示名称"
            name="extension_name"
            type="text"
            :rules="[
              validationRules.minLength(3),
              validationRules.maxLength(63),
              validationRules.required(),
            ]"
            :required="true"
            :requiredIcon="false"
            placeholder="我的扩展"
            :disabled="loading"
            @validate="
              (isValid: boolean) =>
                handleFieldValidation('extension_name', isValid)
            "
          />
          <ElementsFormInput
            v-model="form.identifier"
            label="标识符"
            description="扩展的唯一标识符"
            name="extension_identifier"
            type="text"
            :rules="[
              validationRules.extensionIdentifier(),
              validationRules.uniqueExtensionIdentifier(),
              validationRules.required(),
            ]"
            :required="true"
            :requiredIcon="false"
            placeholder="myextension"
            :disabled="loading"
            @validate="
              (isValid: boolean) =>
                handleFieldValidation('extension_identifier', isValid)
            "
          />
        </div>

        <ElementsFormInput
          v-model="form.summary"
          label="简介"
          description="扩展的简短描述"
          name="extension_summary"
          type="text"
          :rules="[
            validationRules.minLength(3),
            validationRules.maxLength(255),
            validationRules.required(),
          ]"
          :required="true"
          :requiredIcon="false"
          placeholder="这是我的扩展 :)"
          :disabled="loading"
          @validate="
            (isValid: boolean) =>
              handleFieldValidation('extension_summary', isValid)
          "
        />

        <ElementsFormBinarytoggle
          v-model="form.type"
          label="Type"
          :options="[
            { value: 'extension', icon: 'memory:cube', label: '扩展' },
            { value: 'theme', icon: 'memory:image', label: '主题' },
          ]"
        />
      </div>
    </template>

    <template #footer>
      <ElementsButton
        label="取消"
        class="w-full md:w-auto"
        @click="modalOpen.new = false"
      />
      <ElementsButton
        label="创建"
        :disabled="
          fieldValidation.extension_name == false ||
          fieldValidation.extension_identifier == false ||
          fieldValidation.extension_summary == false ||
          form.name == '' ||
          form.identifier == '' ||
          form.summary == '' ||
          (form.type != 'extension' && form.type != 'theme') ||
          loading
        "
        @click="handleCreate"
        type="submit"
        class="order-first w-full md:order-[unset] md:w-auto"
      />
    </template>
  </ElementsModal>
</template>

<script setup lang="ts">
const { rules: validationRules } = useFormValidation()
const router = useRouter()

const loading = ref(false)
const errors = ref(false)
const fieldValidation = ref<Record<string, boolean>>({})
const modalOpen = ref({
  new: false,
})
const form = ref<{
  identifier: string
  name: string
  platforms: ExtensionPlatforms
  summary: string
  type: ExtensionType
  unlisted: boolean
}>({
  identifier: '',
  name: '',
  platforms: {},
  summary: '',
  type: 'extension',
  unlisted: true,
})

const handleFieldValidation = (field: string, isValid: boolean) => {
  fieldValidation.value[field] = isValid
}

const handleCreate = async () => {
  errors.value = false
  loading.value = true

  try {
    await $fetch('/api/user/extensions', {
      method: 'POST',
      body: form.value,
    })
    window.location.reload()
  } catch (error) {
    console.error(error)
    errors.value = true
  } finally {
    loading.value = false
  }
}
</script>
