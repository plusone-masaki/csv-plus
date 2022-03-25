import {
  nextTick,
  onMounted,
  onUnmounted,
  watch,
} from 'vue'
import * as channels from '@/assets/constants/channels'
import { UseTab } from '@/renderer/pages/composables/useTabs'

export default (useTab: UseTab) => {
  watch(useTab.activeTab, tab => {
    if (!tab) return

    // 画面リサイズ時に再描画する
    window.onresize = async () => {
      await nextTick()
      if (tab.table.instance && !tab.table.instance!.isDestroyed) {
        useTab.activeTab.value?.table.instance!.render()
      }
    }
  })

  // Search
  watch(
    () => useTab.activeTab.value?.table.options.search.enable,
    e => e && useTab.activeTab.value?.table.search({ preserve: true, delay: false }),
  )

  // HandsOnTable インスタンスが起動した時
  watch(() => useTab.activeTab.value?.table.instance, instance => {
    if (instance && !instance.isDestroyed) {
      // IPC イベントの再登録
      window.api.on(channels.MENU_SELECT_ALL, useTab.activeTab.value!.table.instance!.selectAll)
      window.api.on(channels.MENU_UNDO, () => useTab.activeTab.value!.table.undoRedo!.undo())
      window.api.on(channels.MENU_REDO, () => useTab.activeTab.value!.table.undoRedo!.redo())
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
    window.api.removeAllListeners(channels.MENU_SELECT_ALL)
    window.api.removeAllListeners(channels.MENU_UNDO)
    window.api.removeAllListeners(channels.MENU_REDO)
    window.removeEventListener('afterprint', afterPrint)
  })
}
