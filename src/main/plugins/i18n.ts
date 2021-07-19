import I18n, { TFunctionKeys, TOptions } from 'i18next'
import ja from '@/assets/lang/ja.json'

const i18n = I18n.createInstance({
  resources: {
    ja: {
      translation: ja,
    },
  },
  lng: 'ja',
  fallbackLng: 'ja',
  ns: 'system',
}, err => {
  if (err) throw err
})

global.__ = (key: TFunctionKeys | TFunctionKeys[], options?: TOptions | string) => i18n.t(key, options)
