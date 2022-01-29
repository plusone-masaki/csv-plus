import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  SetupContext,
  WritableComputedRef,
} from 'vue'
import * as channels from '@/common/channels'
import { Tab } from '@/@types/types'
import vModel from '@/renderer/helpers/v-model'

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

  const anyDelimiter = ref('')

  const menu: Menu = reactive({
    delimiter: false,
    linefeed: false,
    encoding: false,
  })

  const items = reactive({
    delimiter: [
      { label: 'カンマ区切り[,]', value: ',' },
      { label: 'タブ区切り　[\t]', value: '\t' },
      { label: 'その他', value: anyDelimiter.value, input: true },
    ],

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

  const showMenu = (menuName: string) => {
    Object.keys(menu).forEach(key => { menu[key] = (key === menuName) && !menu[key] })
  }

  const confirmReload = (menuName?: string) => {
    if (menuName) showMenu(menuName)
    if (!props.modelValue) return

    props.modelValue.dirty = true
    const file = props.modelValue.file
    window.api[channels.FILE_RELOAD](file.path, JSON.stringify(file.meta))
  }

  const changeBOM = () => {
    if (!props.modelValue) return
    props.modelValue.dirty = true
    props.modelValue.file.meta.bom = !props.modelValue.file.meta.bom
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
    showMenu,
    confirmReload,
    changeBOM,
    closeDropdown,
  }
}
