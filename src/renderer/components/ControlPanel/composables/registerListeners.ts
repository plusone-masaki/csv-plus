import { ipcRenderer } from 'electron'
import { WritableComputedRef } from 'vue'
import { Options } from '@/common/types'
import * as channels from '@/common/channels'
import shortcut from '@/renderer/utils/Shortcut'

interface Events {
  add: () => void;
  save: () => void;
  open: () => void;
  print: () => void;
}

export default (options: WritableComputedRef<Options>, events: Events) => {
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
  shortcut.addShortcutEvent('search_open', () => {
    options.value.search.enable = !options.value.search.enable
    options.value.search.enableReplace = false
  })
  shortcut.addShortcutEvent('search_close', () => { options.value.search.enable = false })
  shortcut.addShortcutEvent('replace_open', () => { options.value.search.enableReplace = options.value.search.enable = true })
}
