import { createApp } from 'vue'
import i18n from '@/renderer/plugins/i18n'
import Page from '@/renderer/pages/SettingsPage.vue'
import '@/assets/sass/global.sass'

createApp(Page)
  .use(i18n)
  .mount('#app')
