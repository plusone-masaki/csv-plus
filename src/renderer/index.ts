import { createApp } from 'vue'
import { vueI18n } from '@/plugins/i18n'
import DefaultLayout from '@/renderer/layouts/Default.vue'
import '@/assets/sass/global.sass'

createApp(DefaultLayout)
  .use(vueI18n)
  .mount('#app')
