import {
  onUnmounted,
  Ref,
  SetupContext,
  watch,
} from 'vue'
import HandsOnTable from 'handsontable'
import { Props } from './types'
import { ipcRenderer } from 'electron'
import * as channels from '@/common/channels'
import shortcut from '@/renderer/utils/Shortcut'

type Refs = {
  search: Ref<HandsOnTable.plugins.Search|null>;
  wrapper: Ref<HTMLDivElement|undefined>;
  settings: Ref<HandsOnTable.DefaultSettings>;
}

export default (props: Props, context: SetupContext, refs: Refs) => {
  watch(() => props.file.path, () => {
    if (props.table) props.table.loadData(props.file.data)
  })

  watch(() => refs.settings.value, settings => {
    if (props.table) props.table.updateSettings(settings, false)
  })

  // Search
  watch(() => props.keyword, keyword => {
    if (props.table && refs.search.value) {
      refs.search.value.query(keyword, refs.search.value.getCallback(), refs.search.value.getQueryMethod())
      props.table.render()
    }
  })

  watch(() => props.options.search, show => {
    if (props.table && refs.search.value) {
      refs.search.value.query(show ? props.keyword : '', refs.search.value.getCallback(), refs.search.value.getQueryMethod())
      props.table.render()
    }
  })

  watch(() => props.table, () => {
    if (props.table) {
      // IPC events
      ipcRenderer.on(channels.MENU_SELECT_ALL, props.table.selectAll)
      ipcRenderer.on(channels.MENU_UNDO, props.table.undo)
      ipcRenderer.on(channels.MENU_REDO, props.table.redo)

      // Key bindings
      shortcut.addShortcutEvent('select_all', props.table.selectAll)
      // shortcut.addShortcutEvent('copy', () => props.table.getSelected() && document.execCommand('copy'))
      // shortcut.addShortcutEvent('cut', () => props.table.getSelected() && document.execCommand('cut'))
      // shortcut.addShortcutEvent('paste', () => props.table.getSelected() && document.execCommand('paste'))
      shortcut.addShortcutEvent('undo', props.table.undo!)
      shortcut.addShortcutEvent('redo', props.table.redo!)
    }
  })

  onUnmounted(() => {
    ipcRenderer.removeAllListeners(channels.MENU_SELECT_ALL)
    ipcRenderer.removeAllListeners(channels.MENU_UNDO)
    ipcRenderer.removeAllListeners(channels.MENU_REDO)
  })
}
