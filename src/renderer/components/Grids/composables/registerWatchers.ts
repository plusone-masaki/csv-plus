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

type Direction = 'up'|'down'|'left'|'right'

export default (props: { tab: Tab }, context: SetupContext, refs: Refs) => {
  const getEdgeCell = (direction: Direction, currentCell?: HandsOnTable.wot.CellRange) => {
    currentCell = currentCell || props.tab.table.instance?.getSelectedRange()?.shift()
    if (!currentCell) return 0

    const data = props.tab.table.options.hasHeader ? props.tab.file.data.slice(1) : props.tab.file.data
    switch (direction) {
      case 'up': {
        const currentRow = Math.min(currentCell.from.row, currentCell.to.row)
        const target = !data[Math.max(currentRow - 1, 0)][currentCell.from.col]
        for (let row = Math.max(currentRow - 2, 0); row >= 0; row--) {
          if (!!data[row][currentCell.from.col] === target) return target ? row : row + 1
        }
        return 0
      }
      case 'down': {
        const length = data.length
        const currentRow = Math.max(currentCell.from.row, currentCell.to.row)
        const target = !data[Math.min(currentRow + 1, length)][currentCell.from.col]
        for (let row = Math.min(currentRow + 2, length); row < length; row++) {
          if (!!data[row][currentCell.from.col] === target) return target ? row : row - 1
        }
        return length - 1
      }
      case 'left': {
        const currentCol = Math.min(currentCell.from.col, currentCell.to.col)
        const target = !data[Math.max(currentCell.from.row, 0)][currentCol - 1]
        for (let col = Math.max(currentCol - 2, 0); col >= 0; col--) {
          if (!!data[currentCell.from.row][col] === target) return target ? col : col + 1
        }
        return 0
      }
      case 'right': {
        const length = data[currentCell.from.col].length
        const currentCol = Math.max(currentCell.from.col, currentCell.to.col)
        const target = !data[currentCell.from.row][Math.min(currentCol + 1, length)]
        for (let col = Math.min(currentCol + 2, length); col < length; col++) {
          if (!!data[currentCell.from.row][col] === target) return target ? col : col - 1
        }
        return length - 1
      }
    }
  }

  const jumpCell = (direction: Direction, fill = false) => {
    const cell = props.tab.table.instance?.getSelectedRange()?.shift()
    if (!props.tab.table.instance || !cell) return

    switch (direction) {
      case 'up':
      case 'down': return props.tab.table.instance.selectCell(fill ? cell.from.row : getEdgeCell(direction, cell), cell.from.col, getEdgeCell(direction, cell), cell.from.col, true)
      case 'left':
      case 'right': return props.tab.table.instance.selectCell(cell.from.row, fill ? cell.from.col : getEdgeCell(direction, cell), cell.from.row, getEdgeCell(direction, cell), true)
    }
  }

  watch(() => props.tab.file.path, () => {
    props.tab.table.instance!.loadData(props.tab.file.data)
  })

  watch(() => refs.settings.value, settings => {
    if (props.tab.table.instance && !props.tab.table.instance.isDestroyed) props.tab.table.instance.updateSettings(settings, false)
  })

  // Search
  watch(() => props.tab.table.options.search.keyword, () => props.tab.table.search!())
  watch(() => props.tab.table.options.search.enable, () => props.tab.table.search!(false, true))

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
      shortcut.addShortcutEvent('search', () => props.tab.table.search!())
      shortcut.addShortcutEvent('search_reverse', () => props.tab.table.search!(true))
      shortcut.addShortcutEvent('jump_up', () => jumpCell('up'))
      shortcut.addShortcutEvent('jump_down', () => jumpCell('down'))
      shortcut.addShortcutEvent('jump_left', () => jumpCell('left'))
      shortcut.addShortcutEvent('jump_right', () => jumpCell('right'))
      shortcut.addShortcutEvent('fill_up', () => jumpCell('up', true))
      shortcut.addShortcutEvent('fill_down', () => jumpCell('down', true))
      shortcut.addShortcutEvent('fill_left', () => jumpCell('left', true))
      shortcut.addShortcutEvent('fill_right', () => jumpCell('right', true))
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
