<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const themeInit = `(() => {
  const key = 'falixer-theme';
  const apply = (theme, persist = false) => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    if (persist) localStorage.setItem(key, theme);
    const dark = theme === 'dark';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#070B14' : '#FFFFFF');
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      button.setAttribute('aria-label', dark ? '切换为日间模式' : '切换为夜间模式');
      button.setAttribute('title', dark ? '日间模式' : '夜间模式');
    });
  };
  try {
    const saved = localStorage.getItem(key);
    apply(saved === 'light' || saved === 'dark' ? saved : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  } catch (_) { apply('light'); }
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element) || !event.target.closest('[data-theme-toggle]')) return;
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    apply(next, true);
  });
})()`

useHead({
  script: [
    {
      key: 'theme-init',
      innerHTML: themeInit,
    },
  ],
  meta: [
    {
      name: 'color-scheme',
      content: 'light dark',
    },
    {
      name: 'theme-color',
      content: '#FFFFFF',
    },
  ],
})
</script>
