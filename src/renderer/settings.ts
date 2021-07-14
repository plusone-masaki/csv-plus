import { createApp } from 'vue'
import { vueI18n } from '@/common/plugins/i18n'
import Page from '@/renderer/pages/SettingsPage.vue'
import '@/assets/sass/global.sass'

createApp(Page)
  .use(vueI18n)
  .mount('#app')
