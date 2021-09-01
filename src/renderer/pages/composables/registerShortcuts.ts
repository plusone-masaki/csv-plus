import {
  watch,
} from 'vue'
import HandsOnTable from 'handsontable'
import { Tab } from '@/@types/types'
import * as shortcuts from '@/common/shortcuts'
import { UseTab, State } from '@/renderer/pages/composables/useTabs'
import shortcut from '@/renderer/plugins/Shortcut'

type Direction = 'up'|'down'|'left'|'right'

const moveTab = (state: State, moveTo: number) => {
  const currentIndex = state.tabs.findIndex(tab => tab.id === state.activeId)
  let index = currentIndex + moveTo

  if (index < 0) {
    index = state.tabs.length - 1
  } else if (index >= state.tabs.length) {
    index = 0
  }

  state.activeId = state.tabs[index].id
}

/**
 * 端のセルまたは次の空白セルの行・列を取得
 *
 * @param {Tab} tab
 * @param {Direction} direction
 * @param {HandsOnTable.wot.CellRange} currentCell
 * @return {number}
 */
const getEdgeCell = (tab: Tab, direction: Direction, currentCell?: HandsOnTable.wot.CellRange) => {
  currentCell = currentCell || tab.table.instance?.getSelectedRange()?.shift()
  if (!currentCell) return 0

  const data = tab.table.options.hasHeader ? tab.file.data.slice(1) : tab.file.data
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
      const length = data.length - 1
      const currentRow = Math.max(currentCell.from.row, currentCell.to.row)
      const target = !data[Math.min(currentRow + 1, length)][currentCell.from.col]
      for (let row = Math.min(currentRow + 2, length); row < length; row++) {
        if (!!data[row][currentCell.from.col] === target) return target ? row : row - 1
      }
      return length
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
      const length = data[currentCell.from.col].length - 1
      const currentCol = Math.max(currentCell.from.col, currentCell.to.col)
      const target = !data[currentCell.from.row][Math.min(currentCol + 1, length)]
      for (let col = Math.min(currentCol + 2, length); col < length; col++) {
        if (!!data[currentCell.from.row][col] === target) return target ? col : col - 1
      }
      return length
    }
  }
}

/**
 * 端または次の空白セルの手前を選択
 *
 * @param {Tab} tab
 * @param {Direction} direction
 * @param {boolean} fill
 */
const jumpCell = (tab: Tab|undefined, direction: Direction, fill = false) => {
  if (!tab) return

  const cell = tab.table.instance?.getSelectedRange()?.shift()
  if (!tab.table.instance || !cell) return

  switch (direction) {
    case 'up':
    case 'down': return tab.table.instance.selectCell(fill ? cell.from.row : getEdgeCell(tab, direction, cell), cell.from.col, getEdgeCell(tab, direction, cell), cell.to.col, true)
    case 'left':
    case 'right': return tab.table.instance.selectCell(cell.from.row, fill ? cell.from.col : getEdgeCell(tab, direction, cell), cell.to.row, getEdgeCell(tab, direction, cell), true)
  }
}

export default (useTab: UseTab) => {
  /**
   * タブがフォーカスされる度にショートカットを上書き登録
   */
  watch(() => useTab.activeTab.value?.table.instance, (table) => {
    const tab = useTab.activeTab.value
    if (tab && table) {
      shortcut.addShortcutEvent(shortcuts.TAB_CLOSE, () => useTab.closeTab(tab))
      shortcut.addShortcutEvent(shortcuts.NEXT_TAB, () => moveTab(useTab.state, 1))
      shortcut.addShortcutEvent(shortcuts.PREV_TAB, () => moveTab(useTab.state, -1))
      shortcut.addShortcutEvent(shortcuts.SELECT_ALL, table.selectAll)
      shortcut.addShortcutEvent(shortcuts.UNDO, () => tab.table.undoRedo!.undo())
      shortcut.addShortcutEvent(shortcuts.REDO, () => tab.table.undoRedo!.redo())
      shortcut.addShortcutEvent(shortcuts.SEARCH_OPEN, () => {
        tab.table.options.search.enable = !tab.table.options.search.enable
        tab.table.options.search.enableReplace = false
      })
      shortcut.addShortcutEvent(shortcuts.SEARCH_CLOSE, () => { tab.table.options.search.enable = false })
      shortcut.addShortcutEvent(shortcuts.REPLACE_OPEN, () => { tab.table.options.search.enableReplace = tab.table.options.search.enable = true })
      shortcut.addShortcutEvent(shortcuts.SEARCH, () => tab.table.search())
      shortcut.addShortcutEvent(shortcuts.SEARCH_REVERSE, () => tab.table.search({ reverse: true }))
      shortcut.addShortcutEvent(shortcuts.JUMP_UP, () => jumpCell(tab, 'up'))
      shortcut.addShortcutEvent(shortcuts.JUMP_DOWN, () => jumpCell(tab, 'down'))
      shortcut.addShortcutEvent(shortcuts.JUMP_LEFT, () => jumpCell(tab, 'left'))
      shortcut.addShortcutEvent(shortcuts.JUMP_RIGHT, () => jumpCell(tab, 'right'))
      shortcut.addShortcutEvent(shortcuts.FILL_UP, () => jumpCell(tab, 'up', true))
      shortcut.addShortcutEvent(shortcuts.FILL_DOWN, () => jumpCell(tab, 'down', true))
      shortcut.addShortcutEvent(shortcuts.FILL_LEFT, () => jumpCell(tab, 'left', true))
      shortcut.addShortcutEvent(shortcuts.FILL_RIGHT, () => jumpCell(tab, 'right', true))
      if (process.platform === 'darwin') {
        shortcut.addShortcutEvent(shortcuts.COPY, () => table.getSelected() && document.execCommand('copy'))
        shortcut.addShortcutEvent(shortcuts.CUT, () => table.getSelected() && document.execCommand('cut'))
        shortcut.addShortcutEvent(shortcuts.PASTE, () => table.getSelected() && document.execCommand('paste'))
      }
    } else {
      shortcut.removeAllShortcutEvents()
    }
  })
}
