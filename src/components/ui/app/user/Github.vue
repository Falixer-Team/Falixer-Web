<template>
  <div class="flex flex-col items-center justify-center bg-neutral-950 p-4">
    <ElementsInlinecard v-if="error == 'enable-error'" class="mb-4 w-full">
      哎呀，无法启用 GitHub OAuth。请稍后重试。
    </ElementsInlinecard>
    <ElementsInlinecard v-if="error == 'disable-error'" class="mb-4 w-full">
      哎呀，无法禁用 GitHub OAuth。请稍后重试。
    </ElementsInlinecard>
    <ElementsInlinecard
      v-if="route.query.reason == 'oauth-complete'"
      class="mb-4 w-full"
    >
      你的 GitHub 账号已连接到 Falixer。如果你想断开连接，可以在下方操作。
    </ElementsInlinecard>
    <div class="flex flex-col items-center py-4">
      <template v-if="user?.github_id">
        <NuxtImg
          :src="githubData?.avatar_url"
          :width="32"
          :height="32"
          class="rounded-sm"
        />
        <br />
        <p class="max-w-100 chrome:-mt-3 my-3 text-center">
          <span>你的 GitHub 账号（</span>
          <NuxtLink :to="githubData?.html_url" class="text-link">
            <b> {{ githubData?.login || user?.github_id }} </b>
          </NuxtLink>
          <span>）已关联到你的账户，可用于登录。</span>
        </p>
        <ElementsButton
          @click="handleDisable"
          color="danger"
          label="断开连接"
          :disabled="loading"
        />
      </template>
      <template v-else>
        <Icon name="pixelarticons:github" :size="32" mode="svg" />
        <br />
        <p class="max-w-100 my-3 text-center">
          你的 GitHub 账号当前尚未连接到 Falixer。
        </p>
        <ElementsButton
          @click="handleEnable"
          label="连接"
          :disabled="loading"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, initializeAuth } = useAuth()
const route = useRoute()

interface GithubUser {
  login: string
  avatar_url: string
  url: string
  html_url: string
}

const loading = ref(false)
const error = ref()

const { data: githubData } = useLazyAsyncData('github-user', async () => {
  if (!user.value?.github_id) return null
  return await $fetch<GithubUser>(
    `https://api.github.com/user/${user.value.github_id}`
  )
})

const handleEnable = async () => {
  loading.value = true
  error.value = ''

  try {
    let oauth_url = await $fetch<{ redirect_url: string }>(
      `/api/user/github?${Date.now()}`,
      {
        method: 'GET',
      }
    )
    navigateTo(oauth_url?.redirect_url, { external: true })
  } catch {
    loading.value = false
    error.value = 'enable-error'
    throw console.error('无法获取 GitHub OAuth 跳转地址，请稍后重试。')
  }
}

const handleDisable = async () => {
  loading.value = true
  error.value = ''
  try {
    await $fetch(`/api/user/github`, {
      method: 'DELETE',
    })
  } catch {
    loading.value = false
    error.value = 'disable-error'
    throw console.error('无法禁用 GitHub OAuth，请稍后重试。')
  } finally {
    await initializeAuth()
    loading.value = false
  }
}
</script>
