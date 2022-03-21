import { Tab, Table } from '@/@types/types'
import * as operations from '@/common/operations'
import History from '@/main/modules/History'

interface Cell {
  hasHeader: boolean
  row?: number
  col?: number
  amount?: number
}

export interface ChangeDetail extends Cell {
  before: string|string[]|string[][]
  after?: string|string[]|string[][]
}

interface Operation {
  operation: string
  details: ChangeDetail[]
}

interface History extends Operation {
  id: number
}

const MAX_HISTORY = 100

export default class UndoRedo {
  private readonly data: string[][] = []
  private readonly table: Table

  private _histories: History[] = []
  private _transactionOperation: History[] = []
  private _pointer = 0
  private _isTransaction = false

  /**
   * シートのセルを変更する
   *
   * @param {Cell} cell
   * @param {string|string[]} data
   * @private
   */
  private _editCell (cell: Cell, data: string|string[]) {
    if (typeof cell.row === 'number' && typeof cell.col === 'number' && typeof data === 'string') {
      this.data[cell.row + Number(cell.hasHeader)][cell.col] = data
    } else if (typeof cell.row === 'number' && typeof data !== 'string') {
      this.data[cell.row + Number(cell.hasHeader)] = data
    } else if (typeof cell.col === 'number' && typeof data === 'string') {
      for (let i = Number(cell.hasHeader); i < this.data.length; i++) {
        this.data[i][cell.col] = data
      }
    }
  }

  /**
   * 行の追加・削除
   */
  private _spliceRow (cell: Cell, amount: number): void
  private _spliceRow (cell: Cell, data: string[][]): void
  private _spliceRow (cell: Cell, data: number|string[][]): void {
    if (typeof data === 'number') {
      // remove row
      this.data.splice(cell.row! + Number(cell.hasHeader), data)
    } else {
      // insert row
      this.data.splice(cell.row! + Number(cell.hasHeader), 0, ...data)
    }
  }

  /**
   * 列の追加・削除
   */
  private _spliceCol (cell: Cell, amount: number): void
  private _spliceCol (cell: Cell, data: string[][]): void
  private _spliceCol (cell: Cell, data: number|string[][]) {
    if (typeof data === 'number') {
      // remove col
      for (let i = 0; i < this.data.length; i++) {
        this.data[i].splice(cell.col!, data)
      }
    } else {
      // insert col
      for (let i = 0; i < this.data.length; i++) {
        this.data[i].splice(cell.col!, 0, ...data[i])
      }
    }
  }

  /**
   * 対象のセルまでジャンプする
   *
   * @param {ChangeDetail} detail
   * @private
   */
  private _jumpToCell (detail: ChangeDetail) {
    if (typeof detail.row === 'number') {
      const currentHeader = Number(this.table.options.hasHeader)
      const hasHeader = Number(detail.hasHeader)
      this.table.instance!.selectCell(
        detail.row - currentHeader + hasHeader,
        detail.col || 0,
        detail.row - currentHeader + hasHeader,
        detail.col || 0,
        true,
      )
    }
  }

  /**
   * 一連の操作を履歴に追加
   *
   * @private
   */
  private _mergeTransaction () {
    // 現在ポインタが指している履歴以降を破棄
    const endIndex = this._histories.findIndex(h => h.id === this._pointer)

    this._histories = this._histories
      .slice(0, endIndex === -1 ? undefined : endIndex)
      // 一連の操作履歴を追加
      .concat(this._transactionOperation)
      // 履歴保持件数より古い履歴を破棄
      .reduce((acc: History[][], history) => {
        const transaction = acc[acc.length - 1]

        if (transaction.length && transaction[0].id === history.id) transaction.push(history)
        else acc.push([history])
        return acc
      }, [[]])
      .slice(-MAX_HISTORY)
      .flat()

    // 一時領域をクリア
    this._transactionOperation = []

    this._pointer++
  }

  public constructor (tab: Tab) {
    this.table = tab.table
    this.data = tab.file.data
  }

  /**
   * 一連の処理をまとめる
   *
   * @param {function} process
   */
  public transaction (process: () => any) {
    try {
      // 現在ポインタが指している履歴以降を破棄
      this.beginTransaction()
      process()
    } finally {
      this.endTransaction()
    }
  }

  public beginTransaction () {
    this._isTransaction = true
  }

  public endTransaction () {
    if (this._isTransaction) {
      this._mergeTransaction()
      // this.table.instance!.render()
      this._isTransaction = false
    }
  }

  /**
   * 操作履歴の追加
   *
   * @param {Operation} operation
   */
  public add (operation: Operation) {
    this._transactionOperation.push({
      id: this._pointer,
      ...operation,
    })

    if (!this._isTransaction) this._mergeTransaction()
  }

  public undo () {
    if (this._pointer <= this._histories[0].id) return

    this._pointer--
    let lastDetails: ChangeDetail|undefined
    this._histories.filter(history => history.id === this._pointer).reverse().forEach(history => {
      const details = history.details

      switch (history.operation) {
        case operations.EDIT:
          details.forEach(detail => this._editCell(detail, detail.before as string))
          break
        case operations.INSERT_ROW:
          details.forEach(detail => this._spliceRow(detail, detail.amount!))
          break
        case operations.REMOVE_ROW:
          details.forEach(detail => this._spliceRow(detail, detail.before as string[][]))
          break
        case operations.INSERT_COL:
          details.forEach(detail => this._spliceCol(detail, detail.amount!))
          break
        case operations.REMOVE_COL:
          details.forEach(detail => this._spliceCol(detail, detail.before as string[][]))
          break
      }
      lastDetails = details[details.length - 1]
    })

    if (lastDetails) this._jumpToCell(lastDetails)
  }

  public redo () {
    if (!this._histories.some(h => h.id >= this._pointer)) return

    let lastDetails: ChangeDetail|undefined
    this._histories.filter(history => history.id === this._pointer).forEach(history => {
      const details = history.details

      switch (history.operation) {
        case operations.EDIT:
          details.forEach(detail => this._editCell(detail, detail.after as string))
          break
        case operations.INSERT_ROW:
          details.forEach(detail => {
            const data: string[][] = [];
            (detail.before as string[][]).forEach(d => {
              for (let i = 0; i < detail.amount!; i++) data.push(d.slice())
            })
            this._spliceRow(detail, data)
          })
          break
        case operations.REMOVE_ROW:
          this._spliceRow(details[0], details[0].amount!)
          break
        case operations.INSERT_COL:
          details.forEach(detail => {
            const data = new Array(this.data.length).fill(new Array(detail.amount).fill(''))
            this._spliceCol(detail, data)
          })
          break
        case operations.REMOVE_COL:
          details.forEach(detail => this._spliceCol(detail, detail.amount!))
          break
      }
      lastDetails = details[details.length - 1]
    })

    this._pointer++
    if (lastDetails) this._jumpToCell(lastDetails)
  }
}
