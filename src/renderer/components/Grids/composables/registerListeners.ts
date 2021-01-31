import { ipcRenderer } from 'electron'
import { Ref, SetupContext } from 'vue'
import HandsOnTable from 'handsontable'
import { Props } from '@/renderer/components/Grids/types'
import * as channels from '@/common/channels'

type Refs = {
  table: Ref<HandsOnTable|null>;
  wrapper: Ref<HTMLDivElement|undefined>;
  settings: Ref<HandsOnTable.GridSettings>;
}

export default (props: Props, context: SetupContext, { table }: Refs) => {
  /**
   * IPC events
   */
  ipcRenderer.on(channels.MENU_SELECT_ALL, () => table.value && table.value.selectAll())
  ipcRenderer.on(channels.MENU_UNDO, () => table.value && table.value.undo())
  ipcRenderer.on(channels.MENU_REDO, () => table.value && table.value.redo())

  /**
   * Key bindings
   */
  document.addEventListener('keydown', (event: KeyboardEvent) => {
    if (!props.active || !table.value) return

    switch (event.key.toUpperCase()) {
      case 'A': // Select all
        if (event.ctrlKey) table.value.selectAll()
        break
      case 'Z': // undo|redo
        if (event.ctrlKey && event.shiftKey) table.value.redo()
        else if (event.ctrlKey) table.value.undo()
        break
    }
  })
}
