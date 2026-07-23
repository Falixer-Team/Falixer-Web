<template>
  <UiMarketingLanding />

  <div class="container grow space-y-20 py-20 md:space-y-32 md:py-28">
    <UiMarketingHighlights />
    <UiMarketingMarquee />
    <UiMarketingHero />
    <UiMarketingRepositories />
    <UiMarketingFaq id="faq" />
    <UiMarketingTestimonials />
    <UiMarketingSponsors />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default-landing',
})

/* tally survey embed code

onMounted(() => {
  if (
    document.referrer.includes('baidu.com') ||
    document.referrer.includes('bilibili.com')
  ) {
    // @ts-expect-error
    Tally.openPopup('b5vK71', {
      doNotShowAfterSubmit: false,
      hideTitle: true,
      overlay: true,
      emoji: {
        text: '💖',
        animation: 'heart-beat',
      },
    })
  }
})
*/
</script>
