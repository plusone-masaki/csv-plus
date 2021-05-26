import { ipcRenderer } from 'electron'
import { SetupContext, WritableComputedRef } from 'vue'
import { Options } from '@/common/types'
import * as channels from '@/common/channels'

interface Events {
  add: () => void;
  save: () => void;
  open: () => void;
  print: () => void;
}

export default (options: WritableComputedRef<Options>, context: SetupContext, events: Events) => {
  /**
   * Window events
   */
  window.addEventListener('afterprint', () => {
    options.value.printMode = false
  })

  /**
   * IPC events
   */
  ipcRenderer.on(channels.MENU_PRINT, events.print)

  /**
   * Key bindings
   */
  document.addEventListener('keydown', (event: KeyboardEvent) => {
    switch (event.key.toUpperCase()) {
      case 'F': // Show search box
        if (event.ctrlKey) options.value.search = !options.value.search
        break
      case 'ESCAPE': // Clear
        options.value.search = false
        break
    }
  })
}
