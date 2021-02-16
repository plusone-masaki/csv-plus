import { createApp } from 'vue'
import { vueI18n } from '@/common/plugins/i18n'
import App from '@/renderer/App.vue'
import 'handsontable/dist/handsontable.full.min.css'
import '@/assets/sass/global.sass'

const app = createApp(App)
app.config.globalProperties.$t = vueI18n.t
app.mount('#app')
