import { createApp } from 'vue'
import i18n from '@/renderer/plugins/i18n'
import Page from '@/renderer/pages/IndexPage.vue'
import 'handsontable/dist/handsontable.full.min.css'
import '@/assets/sass/global.sass'

createApp(Page)
  .use(i18n)
  .mount('#app')
