import { createApp } from 'vue'
import { vueI18n } from '@/common/plugins/i18n'
import Page from '@/renderer/components/Pages/SettingsPage.vue'
import '@/assets/sass/global.sass'

const app = createApp(Page)
app.config.globalProperties.$t = vueI18n.t
app.mount('#app')
