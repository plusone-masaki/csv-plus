import { createI18n } from 'vue-i18n'
import ja from '@/assets/lang/ja.json'

export const vueI18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'ja',
  fallbackLocale: 'ja',
  messages: {
    ja,
  },
})
