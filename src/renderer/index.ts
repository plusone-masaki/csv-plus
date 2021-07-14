import { createApp } from 'vue'
import { vueI18n } from '@/common/plugins/i18n'
import Page from '@/renderer/pages/IndexPage.vue'
import 'handsontable/dist/handsontable.full.min.css'
import '@/assets/sass/global.sass'

createApp(Page)
  .use(vueI18n)
  .mount('#app')
