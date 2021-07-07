import {
  nextTick,
  onUnmounted,
  Ref,
  SetupContext,
  watch,
} from 'vue'
import HandsOnTable from 'handsontable'
import { ipcRenderer } from 'electron'
import { Tab } from '@/common/types'
import * as channels from '@/common/channels'
import useSearch from '@/renderer/components/Grids/composables/useSearch'
import shortcut from '@/renderer/utils/Shortcut'

type Refs = {
  wrapper: Ref<HTMLDivElement|undefined>;
  settings: Ref<HandsOnTable.DefaultSettings>;
}

export default (props: { tab: Tab }, context: SetupContext, refs: Refs) => {
  watch(() => props.tab.file.path, () => {
    if (props.tab.table) props.tab.table.loadData(props.tab.file.data)
  })

  watch(() => refs.settings.value, settings => {
    if (props.tab.table && !props.tab.table.isDestroyed) props.tab.table.updateSettings(settings, false)
  })

  // Search
  watch(() => props.tab.options.search.keyword, () => useSearch(props.tab.table, props.tab.options.search))
  watch(() => props.tab.options.search.enable, () => useSearch(props.tab.table, props.tab.options.search))

  watch(() => props.tab.table, () => {
    if (props.tab.table) {
      // IPC events
      ipcRenderer.on(channels.MENU_SELECT_ALL, props.tab.table.selectAll)
      ipcRenderer.on(channels.MENU_UNDO, props.tab.table.undo)
      ipcRenderer.on(channels.MENU_REDO, props.tab.table.redo)

      // Key bindings
      shortcut.addShortcutEvent('select_all', props.tab.table.selectAll)
      shortcut.addShortcutEvent('undo', props.tab.table.undo!)
      shortcut.addShortcutEvent('redo', props.tab.table.redo!)
      if (process.platform === 'darwin') {
        shortcut.addShortcutEvent('copy', () => props.tab.table!.getSelected() && document.execCommand('copy'))
        shortcut.addShortcutEvent('cut', () => props.tab.table!.getSelected() && document.execCommand('cut'))
        shortcut.addShortcutEvent('paste', () => props.tab.table!.getSelected() && document.execCommand('paste'))
      }

      window.onresize = async () => {
        if (props.tab.table) {
          await nextTick()
          props.tab.table.render()
        }
      }
    }
  })

  onUnmounted(() => {
    ipcRenderer.removeAllListeners(channels.MENU_SELECT_ALL)
    ipcRenderer.removeAllListeners(channels.MENU_UNDO)
    ipcRenderer.removeAllListeners(channels.MENU_REDO)
  })
}
