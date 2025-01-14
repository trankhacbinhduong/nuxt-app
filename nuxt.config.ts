// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint'],
  devtools: { enabled: true },
  css: ['~/assets/app.css'],
  compatibilityDate: '2024-11-01',
  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
      },
    },
  },
})
