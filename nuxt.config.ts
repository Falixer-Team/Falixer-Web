import tailwindcss from '@tailwindcss/vite'
import type { NuxtPage } from 'nuxt/schema'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-20',
  srcDir: 'src/',
  runtimeConfig: {
    backendApiBase: process.env.BACKEND_API_BASE || 'http://localhost:8000/api',
    turnstileSecret: process.env.TURNSTILE_SECRET_KEY || '',
    smtp: {
      host: process.env.SMTP_HOST || '',
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
      from: process.env.SMTP_FROM || '',
    },
    emailCode: {
      expiresInSeconds: Number(process.env.EMAIL_CODE_EXPIRES_IN || 600),
      resendInSeconds: Number(process.env.EMAIL_CODE_RESEND_IN || 60),
      maxAttempts: Number(process.env.EMAIL_CODE_MAX_ATTEMPTS || 5),
    },
    public: {
      licenseApiBase:
        process.env.NUXT_PUBLIC_LICENSE_API_BASE ||
        'https://licences.falixer.dev',
    },
  },
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  modules: [
    '@nuxt/icon',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxt/content',
    '@nuxtjs/sitemap',
    '@nuxtjs/mdc',
    '@nuxtjs/plausible',
    '@nuxtjs/turnstile',
    '@vueuse/nuxt',
    'nuxt-og-image',
    'nuxt-site-config',
    '@nuxt/scripts',
  ],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'Falixer',
      htmlAttrs: {
        lang: 'zh-CN',
      },
      script: [
        {
          src: 'https://tally.so/widgets/embed.js',
        },
      ],
    },
  },
  sitemap: {
    sitemapsPathPrefix: '/',
    zeroRuntime: true,
  },
  ogImage: {
    fonts: [
      'Roboto:400',
      'Roboto:700',
      'Funnel+Display:400',
      'Funnel+Display:700',
    ],
    zeroRuntime: true,
  },
  icon: {
    localApiEndpoint: '/__nuxt_icon',
  },
  imports: {
    dirs: ['types/**/*.ts', 'types/**/*.d.ts'],
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['debug'],
    },
  },
  components: {
    dirs: [
      {
        path: '~/components/prose',
        global: true,
      },
      '~/components',
    ],
  },
  content: {
    build: {
      markdown: {
        highlight: {
          theme: 'github-dark',
          langs: [
            'json',
            'js',
            'ts',
            'tsx',
            'html',
            'css',
            'vue',
            'shell',
            'md',
            'yaml',
            'diff',
            'php',
          ],
        },
      },
    },
  },
  mdc: {
    components: {
      prose: true,
    },
  },
  site: {
    url: 'https://blueprint.zip',
    name: 'Falixer',
  },
  nitro: {
    devProxy: {
      '/api': {
        // Change to https://blueprint.zip/api to use the production API
        // Local API is http://localhost:8000/api
        target: 'http://localhost:8000/api',
        changeOrigin: true,
      },
      // You shouldn't really need the sitemap in development, but if you
      // really want it, and can't be arsed to make it accurate, you may
      // change this to https://blueprint.zip/browse/sitemap.xml, though
      // make sure to set "changeOrigin" to true.
      '/browse/sitemap.xml': 'http://localhost:8000/browse/sitemap.xml',
    },
    routeRules: {
      '/api/**': {
        prerender: false,
        headers: { 'cache-control': 'no-cache' },
      },
      '/browse/**': {
        prerender: false,
      },
    },
  },
  routeRules: {
    '/__og-image__/image/**': {
      proxy: { to: '/__og-image__/static/**' },
    },
  },
  plausible: {
    apiHost: 'https://plausible.prpl.wtf',
    domain: 'blueprint.zip',
    autoOutboundTracking: true,
    ignoredHostnames: ['localhost'],
  },
  turnstile: {
    siteKey: process.env.TURNSTILE_PUBLIC || '0x4AAAAAAB7bNfQex8uoMyq6',
  },

  hooks: {
    'nitro:build:public-assets': async (nitro) => {
      if (nitro.options.preset === 'static') {
        const { promises: fs } = await import('fs')
        const { join } = await import('path')

        const publicDir = nitro.options.output.publicDir
        const srcPath = join(publicDir, '__og-image__', 'static')
        const destPath = join(publicDir, '__og-image__', 'image')

        try {
          await fs.cp(srcPath, destPath, { recursive: true })
        } catch (err) {
          console.warn('og-image copy failed:', err)
        }
      }
    },
    'pages:extend'(pages) {
      function setMiddleware(pages: NuxtPage[]) {
        for (const page of pages) {
          page.meta ||= {}
          if (!page.meta.middleware) {
            page.meta.middleware = ['default']
          }
          if (page.children) {
            setMiddleware(page.children)
          }
        }
      }
      setMiddleware(pages)
    },
  },
})
