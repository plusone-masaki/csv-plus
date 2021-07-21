import {
  nextTick,
  onMounted,
  onUnmounted,
  watch,
} from 'vue'
import { ipcRenderer } from 'electron'
import * as channels from '@/common/channels'
import { UseTab } from '@/renderer/pages/composables/useTabs'

export default (useTab: UseTab) => {
  watch(() => useTab.state.activeId, () => {
    // 画面リサイズ時に再描画するリスナを登録
    window.onresize = async () => {
      await nextTick()
      if (useTab.activeTab.value?.table.instance && !useTab.activeTab.value?.table.instance!.isDestroyed) {
        useTab.activeTab.value?.table.instance!.render()
      }
    }
  })

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
