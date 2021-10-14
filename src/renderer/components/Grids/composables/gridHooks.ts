import { nextTick, SetupContext } from 'vue'
import { Tab } from '@/@types/types'
import * as operations from '@/common/operations'
import shortcut from '@/renderer/plugins/Shortcut'
import { ChangeDetail } from '@/renderer/plugins/UndoRedo'

interface Cell {
  startRow: number
  startCol: number
  endRow: number
  endCol: number
}

const HISTORY_INTERVAL = 500
let commit: NodeJS.Timeout

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
          before: detail[2] ?? '',
          after: detail[3],
        })),
      })
      props.tab.table.undoRedo!.endTransaction()
    }
  },

  afterCreateCol: () => {
    commit = setTimeout(() => props.tab.table.undoRedo!.endTransaction(), HISTORY_INTERVAL)
  },

  afterRemoveCol: () => {
    commit = setTimeout(() => props.tab.table.undoRedo!.endTransaction(), HISTORY_INTERVAL)
  },

  afterCreateRow: () => {
    commit = setTimeout(() => props.tab.table.undoRedo!.endTransaction(), HISTORY_INTERVAL)
  },

  afterRemoveRow: () => {
    commit = setTimeout(() => props.tab.table.undoRedo!.endTransaction(), HISTORY_INTERVAL)
  },

  afterInit: async () => {
    await nextTick()
    if (props.tab.calculation.selected) {
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

      props.tab.table.undoRedo!.beginTransaction()
      props.tab.table.undoRedo!.add({
        operation: operations.INSERT_COL,
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
        .map(data => {
          const colData = []
          for (let i = col; i < col + amount; i++) colData.push(data[i] ?? '')
          return colData
        }),
    }]

    props.tab.table.undoRedo!.beginTransaction()
    props.tab.table.undoRedo!.add({
      operation: operations.REMOVE_COL,
      details,
    })
  },

  beforeCreateRow: (row: number, amount: number) => {
    if (!props.tab.table.instance) return
    props.tab.dirty = true

    // 操作履歴の追加
    const details = [{
      hasHeader: props.tab.table.options.hasHeader,
      row,
      amount,
      before: [new Array(props.tab.file.data[0].length).fill('')],
    }]

    props.tab.table.undoRedo!.beginTransaction()
    props.tab.table.undoRedo!.add({
      operation: operations.INSERT_ROW,
      details,
    })
  },

  beforeRemoveRow: (row: number, amount: number) => {
    props.tab.dirty = true

    // 操作履歴の追加
    const before = []
    for (let i = row; i < row + amount; i++) {
      before.push(props.tab.file.data[i + Number(props.tab.table.options.hasHeader)])
    }

    props.tab.table.undoRedo!.beginTransaction()
    props.tab.table.undoRedo!.add({
      operation: operations.REMOVE_ROW,
      details: [{
        hasHeader: props.tab.table.options.hasHeader,
        row,
        amount,
        before,
      }],
    })
  },

  beforeCopy: (data: string[][]) => {
    // 設定された区切り文字・改行コードでデータをコピー
    if (navigator.clipboard) {
      const linefeed = props.tab.file.meta.linefeed === 'LF' ? '\n' : '\r\n'
      const dataString = data.map(row => row.join(props.tab.file.meta.delimiter)).join(linefeed)
      navigator.clipboard.writeText(dataString)
      return false
    }
  },

  beforePaste: (data: string[][], cells: Cell[]) => {
    props.tab.table.undoRedo!.endTransaction()
    clearTimeout(commit)

    // 区切り文字で分割してペーストする
    if (data[0].length === 1) {
      props.tab.table.undoRedo!.transaction(() => {
        const hasHeader = props.tab.table.options.hasHeader
        const details: ChangeDetail[] = []

        // 行がはみ出る場合、事前に行を追加する
        if (props.tab.file.data.length <= cells[0].startRow + data.length + Number(hasHeader)) {
          const rowLength = props.tab.file.data.length - 1
          props.tab.table.instance!
            .alter(operations.INSERT_ROW, rowLength, (cells[0].startRow + data.length + Number(hasHeader)) - rowLength)
        }

        cells.forEach((cell) => {
          for (let i = 0; i < data.length; i++) {
            const row = cell.startRow + i
            const rowData = data[i][0].split(props.tab.file.meta.delimiter)

            // 列がはみ出る場合、事前に列を追加する
            if (props.tab.file.data[0].length <= cell.startCol + rowData.length) {
              const colLength = props.tab.file.data[0].length - 1
              props.tab.table.instance!
                .alter(operations.INSERT_COL, colLength, (cell.startCol + rowData.length) - colLength)
            }

            for (let col = cell.startCol; col - cell.startCol < rowData.length; col++) {
              if (!props.tab.file.data[row]) props.tab.file.data.push([])

              details.push({
                hasHeader,
                row,
                col,
                before: props.tab.file.data[row + Number(hasHeader)][col] ?? '',
                after: rowData[col - cell.startCol],
              })
              props.tab.file.data[row + Number(hasHeader)][col] = rowData[col - cell.startCol]
            }
          }

          // 操作履歴の追加
          props.tab.table.undoRedo!.add({
            operation: operations.EDIT,
            details,
          })
        })
      })

      props.tab.table.instance!.render()
      // 標準のペースト機能を中止
      return false
    }
  },

  beforeSetRangeEnd: () => props.tab.table.borders?.clearBorders(),

  beforeKeyDown: (event: any) => {
    // キーバインドが登録済みの場合、HandsOnTableのキーバインディングを無効化
    if (shortcut.existsKeyBinding(event as KeyboardEvent)) {
      event.isImmediatePropagationEnabled = false
      event.isImmediatePropagationStopped = () => true
    }
  },

  modifyRow: (row: number) => {
    if (!props.tab.table.options.hasHeader) return row
    row += Number(props.tab.table.options.hasHeader)
    return row < props.tab.file.data.length ? row : null
  },
})
