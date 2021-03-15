import { ipcRenderer } from 'electron'
import { Props } from './types'
import * as channels from '@/common/channels'

export default (props: Props) => {
  /**
   * IPC events
   */
  ipcRenderer.on(channels.MENU_SELECT_ALL, () => props.active && props.table && props.table.selectAll())
  ipcRenderer.on(channels.MENU_UNDO, () => props.active && props.table && props.table.undo())
  ipcRenderer.on(channels.MENU_REDO, () => props.active && props.table && props.table.redo())

  /**
   * Key bindings
   */
  document.addEventListener('keydown', (event: KeyboardEvent) => {
    if (!props.active || !props.table) return

    switch (event.key.toUpperCase()) {
      case 'A': // Select all
        if (event.ctrlKey) props.table.selectAll()
        break
      case 'Z': // undo|redo
        if (event.ctrlKey && event.shiftKey) props.table.redo()
        else if (event.ctrlKey) props.table.undo()
        break
    }
  })
}
