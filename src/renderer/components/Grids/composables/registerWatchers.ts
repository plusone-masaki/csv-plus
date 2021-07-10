import {
  onUnmounted,
  Ref,
  SetupContext,
  watch,
} from 'vue'
import HandsOnTable from 'handsontable'
import { ipcRenderer } from 'electron'
import { Tab } from '@/common/types'
import * as channels from '@/common/channels'
import shortcut from '@/renderer/utils/Shortcut'

type Refs = {
  wrapper: Ref<HTMLDivElement|undefined>;
  settings: Ref<HandsOnTable.DefaultSettings>;
}

export default (props: { tab: Tab }, context: SetupContext, refs: Refs) => {
  watch(() => props.tab.file.path, () => {
    props.tab.table.instance!.loadData(props.tab.file.data)
  })

  watch(() => refs.settings.value, settings => {
    if (props.tab.table.instance && !props.tab.table.instance.isDestroyed) props.tab.table.instance.updateSettings(settings, false)
  })

  // Search
  watch(() => props.tab.table.options.search.keyword, () => props.tab.table.search!())
  watch(() => props.tab.table.options.search.enable, () => props.tab.table.search!(false, true))
  shortcut.addShortcutEvent('search', () => props.tab.table.search!())
  shortcut.addShortcutEvent('search_reverse', () => props.tab.table.search!(true))

  watch(() => props.tab.table.instance, () => {
    if (props.tab.table.instance) {
      // IPC events
      ipcRenderer.on(channels.MENU_SELECT_ALL, props.tab.table.instance.selectAll)
      ipcRenderer.on(channels.MENU_UNDO, props.tab.table.instance.undo)
      ipcRenderer.on(channels.MENU_REDO, props.tab.table.instance.redo)

      // Key bindings
      shortcut.addShortcutEvent('select_all', props.tab.table.instance.selectAll)
      shortcut.addShortcutEvent('undo', props.tab.table.instance.undo!)
      shortcut.addShortcutEvent('redo', props.tab.table.instance.redo!)
      if (process.platform === 'darwin') {
        shortcut.addShortcutEvent('copy', () => props.tab.table.instance!.getSelected() && document.execCommand('copy'))
        shortcut.addShortcutEvent('cut', () => props.tab.table.instance!.getSelected() && document.execCommand('cut'))
        shortcut.addShortcutEvent('paste', () => props.tab.table.instance!.getSelected() && document.execCommand('paste'))
      }
    }
  })

  onUnmounted(() => {
    ipcRenderer.removeAllListeners(channels.MENU_SELECT_ALL)
    ipcRenderer.removeAllListeners(channels.MENU_UNDO)
    ipcRenderer.removeAllListeners(channels.MENU_REDO)
  })
}
