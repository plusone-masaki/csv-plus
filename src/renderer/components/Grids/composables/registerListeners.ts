import { ipcRenderer } from 'electron'
import { onMounted, onUnmounted } from 'vue'
import { Props } from './types'
import * as channels from '@/common/channels'

export default (props: Props) => {
  const keyBindings = (event: KeyboardEvent) => {
    if (!props.table) return

    switch (event.key.toUpperCase()) {
      case 'A': // Select all
        if (event.ctrlKey) props.table.selectAll()
        break
      case 'Z': // undo|redo
        if (event.ctrlKey && event.shiftKey) props.table.redo()
        else if (event.ctrlKey) props.table.undo()
        break
    }
  }

  onMounted(() => {
    /**
     * IPC events
     */
    ipcRenderer.on(channels.MENU_SELECT_ALL, () => props.table && props.table.selectAll())
    ipcRenderer.on(channels.MENU_UNDO, () => props.table && props.table.undo())
    ipcRenderer.on(channels.MENU_REDO, () => props.table && props.table.redo())

    /**
     * Key bindings
     */
    document.addEventListener('keydown', keyBindings)
  })

  onUnmounted(() => {
    ipcRenderer.removeAllListeners(channels.MENU_SELECT_ALL)
    ipcRenderer.removeAllListeners(channels.MENU_UNDO)
    ipcRenderer.removeAllListeners(channels.MENU_REDO)
    document.removeEventListener('keydown', keyBindings)
  })
}
