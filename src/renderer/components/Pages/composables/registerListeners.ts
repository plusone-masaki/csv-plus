import {
  onMounted,
  onUnmounted,
  watch,
} from 'vue'
import { ipcRenderer } from 'electron'
import * as channels from '@/common/channels'
import { UseTab } from '@/renderer/components/Pages/composables/types'

export default (useTab: UseTab) => {
  // Search
  watch(() => useTab.activeTab.value?.table.options.search.keyword, () => useTab.activeTab.value?.table.search())
  watch(() => useTab.activeTab.value?.table.options.search.enable, () => useTab.activeTab.value?.table.search(false, true))

  // IPC events
  watch(() => useTab.activeTab.value?.table.instance, () => {
    if (useTab.activeTab.value?.table.instance) {
      ipcRenderer.on(channels.MENU_SELECT_ALL, useTab.activeTab.value?.table.instance.selectAll)
      ipcRenderer.on(channels.MENU_UNDO, useTab.activeTab.value?.table.instance.undo)
      ipcRenderer.on(channels.MENU_REDO, useTab.activeTab.value?.table.instance.redo)
    }
  })

  const afterPrint = () => {
    const tab = useTab.activeTab.value
    if (tab) tab.table.options.printMode = false
  }

  onMounted(() => {
    window.addEventListener('afterprint', afterPrint)
  })

  onUnmounted(() => {
    ipcRenderer.removeAllListeners(channels.MENU_SELECT_ALL)
    ipcRenderer.removeAllListeners(channels.MENU_UNDO)
    ipcRenderer.removeAllListeners(channels.MENU_REDO)
    window.removeEventListener('afterprint', afterPrint)
  })
}
