import { ipcRenderer } from 'electron'
import { computed, reactive, ref } from 'vue'
import * as channels from '@/common/channels'
import { vueI18n } from '@/common/plugins/i18n'
import HandsOnTable from 'handsontable'
import { FileData, Options } from '@/renderer/types'
import { Tabs } from '@/renderer/composables/types'
import csvStringify from 'csv-stringify/lib/sync'

const defaultOptions = (): Options => ({
  hasHeader: false,
  delimiter: ',',
  quoteChar: '"',
  escapeChar: '"',
})

export default (): Tabs => {
  const { t } = vueI18n

  const count = ref(0)
  const newTab = `newTab${count.value++}`

  const state = reactive({
    count,
    active: newTab,
    files: [
      {
        label: t('tabs.new_tab'),
        path: newTab,
        dirty: false,
        data: HandsOnTable.helper.createEmptySpreadsheetData(100, 26),
        options: defaultOptions(),
      },
    ],
  })

  const options = computed<Options>({
    get: () => {
      const file = state.files.find(file => file.path === state.active)
      return file ? file.options : defaultOptions()
    },
    set: file => {
      const index = state.files.findIndex((f: FileData) => f.path === state.active)
      if (index !== -1) state.files[index].options = file
    },
  })

  const onEdit = () => {
    const fileData = state.files.find(t => t.path === state.active)
    if (fileData) fileData.dirty = true
  }

  const addTab = (fileData?: FileData) => {
    fileData = fileData || {
      label: t('tabs.new_tab'),
      path: `newTab${count.value++}`,
      dirty: false,
      data: HandsOnTable.helper.createEmptySpreadsheetData(100, 26),
      options: {
        hasHeader: false,
        delimiter: ',',
        quoteChar: '"',
        escapeChar: '"',
      },
    }

    state.files.push(fileData)
    state.active = fileData.path
  }

  const closeTab = async (fileData: FileData) => {
    // ファイルが未保存の場合は確認ダイアログを表示
    if (fileData.dirty) {
      const item = {
        name: fileData.label,
        path: fileData.path,
        data: csvStringify(fileData.data),
      }
      if (!await ipcRenderer.invoke(channels.FILE_DESTROY_CONFIRM, item)) return
    }

    const index = state.files.findIndex(t => t === fileData)
    state.files.splice(index, 1)

    if (!state.files.length) return
    if (!state.files.find(t => t.path === state.active)) {
      state.active = state.files[index]?.path || state.files[0].path
    }
  }

  return {
    state,
    options,
    onEdit,
    addTab,
    closeTab,
  }
}
