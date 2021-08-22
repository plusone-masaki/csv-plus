import { nextTick, SetupContext } from 'vue'
import { Tab } from '@/@types/types'
import * as operations from '@/common/operations'
import shortcut from '@/renderer/plugins/Shortcut'

export default (props: { tab: Tab }, context: SetupContext) => ({
  afterChange: (details: [number, string|number, string, string][]|null, operation: string) => {
    if (!['loadData', 'ObserveChanges.change'].includes(operation)) {
      context.emit('edit')

      // 操作履歴の追加
      props.tab.table.undoRedo!.add({
        operation: operations.EDIT,
        details: details!.map(detail => ({
          hasHeader: props.tab.table.options.hasHeader,
          row: detail[0],
          col: detail[1] as number,
          before: detail[2],
          after: detail[3],
        })),
      })
    }
  },

  afterInit: async () => {
    if (props.tab.calculation.selected) {
      await nextTick()
      const { startRow, startCol, endRow, endCol } = props.tab.calculation.selected
      // eslint-disable-next-line no-unused-expressions
      props.tab.table.instance?.selectCell(startRow, startCol, endRow, endCol, true)
    }
  },

  afterSelection: (startRow: number, startCol: number, endRow: number, endCol: number) => {
    if (!props.tab.table.instance) return

    const rowLength = endRow - startRow
    const colLength = endCol - startCol

    const values = props.tab.table.instance.getData(startRow, startCol, endRow, endCol).flat() as string[]
    props.tab.calculation.selected = {
      startRow,
      endRow,
      startCol,
      endCol,
      summary: (rowLength || colLength) && values.reduce((a, b) => a + Number(b), 0),
    }
  },

  beforeCreateRow: (row: number, amount: number) => {
    if (props.tab.table.instance) {
      props.tab.dirty = true

      // 操作履歴の追加
      const details = []
      for (let i = row; i < row + amount; i++) {
        details.push({
          hasHeader: props.tab.table.options.hasHeader,
          row: i,
          amount,
          before: [],
        })
      }

      props.tab.table.undoRedo!.add({
        operation: operations.ROW_INSERT,
        details,
      })
    }
  },

  beforeRemoveRow: (row: number, amount: number) => {
    props.tab.dirty = true

    // 操作履歴の追加
    const details = []
    for (let i = row; i < row + amount; i++) {
      details.push({
        hasHeader: props.tab.table.options.hasHeader,
        row: i,
        amount,
        before: props.tab.file.data[i + Number(props.tab.table.options.hasHeader)],
      })
    }

    props.tab.table.undoRedo!.add({
      operation: operations.ROW_REMOVE,
      details,
    })
  },

  beforeCreateCol: (col: number, amount: number) => {
    if (props.tab.table.instance) {
      props.tab.dirty = true

      // 操作履歴の追加
      const emptyCols = () => new Array(amount).fill('')
      const details = [{
        hasHeader: props.tab.table.options.hasHeader,
        col,
        amount,
        before: emptyCols(),
      }]

      props.tab.table.undoRedo!.add({
        operation: operations.COL_INSERT,
        details,
      })
    }
  },

  beforeRemoveCol: (col: number, amount: number) => {
    props.tab.dirty = true

    // 操作履歴の追加
    const details = [{
      hasHeader: props.tab.table.options.hasHeader,
      col,
      amount,
      before: props.tab.file.data
        .slice(Number(props.tab.table.options.hasHeader))
        .map(data => {
          const colData = []
          for (let i = col; i < col + amount; i++) colData.push(data[i])
          return colData
        }),
    }]

    props.tab.table.undoRedo!.add({
      operation: operations.COL_REMOVE,
      details,
    })
  },

  beforeSetRangeEnd: () => props.tab.table.borders?.clearBorders(),

  beforeKeyDown: (event: any) => {
    // キーバインドが登録済みの場合、HandsOnTableのキーバインディングを無効化
    if (shortcut.existsKeyBinding(event as KeyboardEvent)) {
      event.isImmediatePropagationEnabled = false
      event.isImmediatePropagationStopped = () => true
    }
  },
})
