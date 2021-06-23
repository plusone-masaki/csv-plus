import { ipcRenderer } from 'electron'
import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  readonly, SetupContext, WritableComputedRef,
} from 'vue'
import * as channels from '@/common/channels'
import { Tab } from '@/common/types'
import vModel from '@/renderer/utils/v-model'

interface Props {
  [key: string]: unknown;
  modelValue: Tab | undefined;
}

interface Menu {
  [key: string]: boolean;
  linefeed: boolean;
  encoding: boolean;
}

export default (props: Props, context: SetupContext) => {
  const tab = vModel('modelValue', props, context) as WritableComputedRef<Tab|undefined>

  const menu: Menu = reactive({
    linefeed: false,
    encoding: false,
  })

  const items = readonly({
    linefeed: [
      { label: 'LF (MacOS/Linux)', value: 'LF' },
      { label: 'CRLF (Windows)', value: 'CRLF' },
    ],

    encoding: [
      { label: 'UTF-8', value: 'UTF-8' },
      { label: 'UTF-16LE', value: 'UTF-16LE' },
      { label: 'UTF-16BE', value: 'UTF-16BE' },
      { label: 'UTF-32LE', value: 'UTF-32LE' },
      { label: 'UTF-32BE', value: 'UTF-32BE' },
      { label: 'Shift_JIS', value: 'Shift_JIS' },
      { label: 'Big5', value: 'Big5' },
      { label: 'EUC-JP', value: 'EUC-JP' },
      { label: 'EUC-KR', value: 'EUC-KR' },
      { label: 'GB18030', value: 'GB18030' },
      { label: 'ISO_2022_JP', value: 'ISO_2022_JP' },
      { label: 'ISO_2022_CN', value: 'ISO_2022_CN' },
      { label: 'ISO_2022_KR', value: 'ISO_2022_KR' },
      { label: 'ISO-8859-1', value: 'ISO-8859-1' },
      { label: 'ISO-8859-2', value: 'ISO-8859-2' },
      { label: 'ISO-8859-5', value: 'ISO-8859-5' },
      { label: 'ISO-8859-6', value: 'ISO-8859-6' },
      { label: 'ISO-8859-7', value: 'ISO-8859-7' },
      { label: 'ISO-8859-8', value: 'ISO-8859-8' },
      { label: 'ISO-8859-9', value: 'ISO-8859-9' },
      { label: 'windows-1250', value: 'windows-1250' },
      { label: 'windows-1251', value: 'windows-1251' },
      { label: 'windows-1252', value: 'windows-1252' },
      { label: 'windows-1253', value: 'windows-1253' },
      { label: 'windows-1254', value: 'windows-1254' },
      { label: 'windows-1255', value: 'windows-1255' },
      { label: 'windows-1256', value: 'windows-1256' },
      { label: 'KOI8-R', value: 'KOI8-R' },
    ],
  })

  const withBOM = computed(() => {
    const bomEncoding = [
      'UTF-8',
      'UTF-16',
      'UTF-32',
    ]
    return !!tab.value && bomEncoding.includes(tab.value.file.meta.encoding)
  })

  const changeEncoding = () => {
    if (!props.modelValue) return
    const file = props.modelValue.file
    ipcRenderer.send(channels.FILE_RELOAD, file.path, JSON.stringify(file.meta))
  }

  const closeDropdown = (e: MouseEvent) => {
    const target = e.target as HTMLElement|null
    if (target && !(target.classList.contains('footer-nav-label') && target.classList.contains('--active'))) {
      Object.keys(menu).forEach(key => { menu[key] = false })
    }
  }

  // ドロップダウン制御
  onMounted(() => {
    document.addEventListener('click', closeDropdown)
  })
  onBeforeUnmount(() => {
    document.removeEventListener('click', closeDropdown)
  })

  return {
    tab,
    menu,
    items,
    withBOM,
    changeEncoding,
    closeDropdown,
  }
}
