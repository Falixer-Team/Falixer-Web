<template>
  <nav
    class="fixed z-50 h-16 w-full border-b border-neutral-700/70 bg-neutral-950/85 backdrop-blur-xl transition-all duration-300 md:max-h-16"
    :class="{
      'h-full': mobileNavigation,
    }"
  >
    <div class="container py-4">
      <div class="relative flex items-center justify-between">
        <BrandWordmark @click="mobileNavigation = false" />
        <div class="hidden items-center justify-between gap-1 text-sm md:flex">
          <UiNavigationLink to="/browse" label="插件" />
          <UiNavigationLink to="/guides" label="指南" />
          <UiNavigationLink to="/docs" label="文档" />
          <span class="mx-2 h-4 w-px bg-neutral-700"></span>
          <button
            type="button"
            data-theme-toggle
            class="hover:text-brand-50 focus-visible:ring-brand-50/30 text-default-font/65 flex size-8 cursor-pointer items-center justify-center rounded-full outline-none transition-colors hover:bg-neutral-900 focus-visible:ring-2"
            aria-label="切换为夜间模式"
            title="夜间模式"
          >
            <Icon
              name="lucide:moon"
              :size="15"
              mode="svg"
              class="theme-icon-moon"
            />
            <Icon
              name="lucide:sun"
              :size="15"
              mode="svg"
              class="theme-icon-sun"
            />
          </button>
          <client-only>
            <div v-if="isAuthenticated" class="flex items-center gap-1">
              <NuxtLink
                to="/app"
                class="hover:text-brand-50 focus:text-brand-50 flex min-h-8 items-center gap-1 rounded-full px-3 outline-0 transition-colors hover:bg-neutral-900"
                @mousedown.prevent
              >
                <Icon name="memory:account" />
                <span> {{ user?.name }} </span>
                <span v-if="user?.admin" class="text-default-font/60">
                  （管理员）
                </span>
              </NuxtLink>
              <NuxtLink
                @click="logout"
                tabindex="0"
                class="flex min-h-[26px] cursor-pointer items-center bg-neutral-900 px-2.5 py-0.5 outline-0 transition-colors hover:bg-red-950 hover:text-red-400 focus:bg-red-950 focus:text-red-400"
                @mousedown.prevent
              >
                <Icon name="memory:logout" mode="svg" />
              </NuxtLink>
            </div>
            <div v-else class="flex items-center gap-1">
              <NuxtLink
                to="/auth"
                class="hover:text-brand-50 focus:text-brand-50 rounded-full px-3 py-1.5 outline-0 transition-colors hover:bg-neutral-900"
                @mousedown.prevent
              >
                <span>登录</span>
              </NuxtLink>
              <NuxtLink
                to="/auth/register"
                class="flex items-center gap-1 rounded-full bg-neutral-50 px-4 py-1.5 text-neutral-950 outline-0 transition-transform hover:-translate-y-0.5"
                @mousedown.prevent
              >
                <span>注册</span>
                <Icon name="memory:chevron-right" />
              </NuxtLink>
            </div>
          </client-only>
        </div>
        <button
          @click="mobileNavigation = !mobileNavigation"
          alt="Toggle navigation menu"
          class="block md:hidden"
        >
          <Icon
            :name="
              mobileNavigation ? 'pixelarticons:close' : 'pixelarticons:menu'
            "
            :size="24"
            mode="svg"
          />
        </button>
      </div>

      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-4"
      >
        <div
          v-show="mobileNavigation"
          @click="mobileNavigation = false"
          class="absolute pt-10 md:hidden"
        >
          <UiNavigationMobilelink
            to="/browse"
            label="插件"
            :visible="mobileNavigation"
          />
          <UiNavigationMobilelink
            to="/guides"
            label="指南"
            :visible="mobileNavigation"
          />
          <UiNavigationMobilelink
            to="/docs"
            label="文档"
            :visible="mobileNavigation"
          />
          <UiNavigationMobilelink
            to="https://hcb.hackclub.com/donations/start/blueprint"
            target="_blank"
            label="捐赠"
            :visible="mobileNavigation"
          />
          <button
            type="button"
            data-theme-toggle
            class="mt-5 flex w-[calc(100vw-2rem)] max-w-80 items-center justify-between rounded-2xl border border-neutral-700 bg-neutral-900 p-3 text-start"
          >
            <span class="theme-label-dark">夜间模式</span>
            <span class="theme-label-light">日间模式</span>
            <Icon
              name="lucide:moon"
              :size="20"
              mode="svg"
              class="theme-icon-moon text-brand-50"
            />
            <Icon
              name="lucide:sun"
              :size="20"
              mode="svg"
              class="theme-icon-sun text-brand-50"
            />
          </button>
          <div class="py-5" />
          <client-only>
            <div
              v-if="isAuthenticated"
              class="w-[calc(100vw-2rem)] max-w-80 divide-y divide-neutral-700 rounded-2xl border border-neutral-700"
            >
              <div class="flex items-center gap-1.5 p-2 font-bold">
                <Icon name="memory:account" />
                <span class="truncate"> {{ user?.name }} </span>
                <span
                  v-if="user?.admin"
                  class="text-default-font/60 font-normal"
                >
                  (admin)
                </span>
              </div>
              <div
                class="flex flex-col gap-2 p-2 opacity-0 transition-opacity duration-500"
                :class="mobileNavigation ? 'opacity-100' : ''"
              >
                <NuxtLink
                  to="/app"
                  class="hover:text-brand-50 block w-full text-start transition-colors"
                  :class="
                    route.path == '/app'
                      ? 'text-default-font'
                      : 'text-default-font/60'
                  "
                >
                  <span>仪表盘</span>
                </NuxtLink>
                <NuxtLink
                  @click="logout"
                  class="text-default-font/60 block w-full cursor-pointer text-start transition-colors hover:text-red-400"
                >
                  <span>退出登录</span>
                </NuxtLink>
              </div>
            </div>
            <template v-else>
              <UiNavigationMobilelink
                to="/auth"
                label="登录"
                :visible="mobileNavigation"
              />
              <UiNavigationMobilelink
                to="/auth/register"
                label="注册"
                :visible="mobileNavigation"
              />
            </template>
          </client-only>
        </div>
      </Transition>
    </div>
    <div
      class="relative top-0 h-px w-full bg-transparent transition-all duration-500 md:static"
      :class="{
        'top-[calc(100dvh-var(--nav-offset))]': mobileNavigation,
      }"
    />
  </nav>
  <div class="h-16"></div>
</template>

<script setup lang="ts">
const { isAuthenticated, user, logout } = useAuth()
const route = useRoute()

const mobileNavigation = ref(false)

watch(mobileNavigation, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<style>
:root {
  --nav-offset: 4rem;
}
</style>
