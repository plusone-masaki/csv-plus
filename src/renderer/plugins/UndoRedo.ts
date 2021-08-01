import { Tab, Table } from '@/@types/types'
import * as operations from '@/common/operations'

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

interface History {
  operation: string
  details: ChangeDetail[]
}

const MAX_HISTORY = 100

export default class UndoRedo {
  private readonly data: string[][] = []
  private readonly table: Table

  private _histories: History[] = []
  private _pointer = 0

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
  private _spliceRow (cell: Cell, data: string[]): void
  private _spliceRow (cell: Cell, data: number|string[]): void {
    if (typeof data === 'number') {
      this.data.splice(cell.row! + Number(cell.hasHeader), data)
    } else {
      this.data.splice(cell.row! + Number(cell.hasHeader), 0, data)
    }
  }

  /**
   * 列の追加・削除
   */
  private _spliceCol (cell: Cell, amount: number): void
  private _spliceCol (cell: Cell, data: string[][]): void
  private _spliceCol (cell: Cell, data: number|string[][]) {
    if (typeof data === 'number') {
      for (let i = Number(cell.hasHeader); i < this.data.length; i++) {
        this.data[i].splice(cell.col!, data)
      }
    } else {
      for (let i = Number(cell.hasHeader); i < this.data.length; i++) {
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

  public constructor (tab: Tab) {
    this.table = tab.table
    this.data = tab.file.data
  }

  public add (history: History) {
    // 現在ポインタが指している履歴以降を破棄
    const histories = this._histories.slice(0, this._pointer)

    // 履歴の追加
    histories.push(history)

    // 履歴保持件数より古い履歴を破棄
    this._histories = histories.slice(-MAX_HISTORY)

    if (this._pointer < MAX_HISTORY) this._pointer++
  }

  public undo () {
    if (!this._pointer) return

    const history = this._histories[--this._pointer]
    const details = history.details

    switch (history.operation) {
      case operations.EDIT:
        details.forEach(detail => this._editCell(detail, detail.before as string))
        break
      case operations.ROW_INSERT:
        details.forEach(detail => this._spliceRow(detail, detail.amount!))
        break
      case operations.ROW_REMOVE:
        details.forEach(detail => this._spliceRow(detail, detail.before as string[]))
        break
      case operations.COL_INSERT:
        details.forEach(detail => this._spliceCol(detail, detail.amount!))
        break
      case operations.COL_REMOVE:
        details.forEach(detail => this._spliceCol(detail, detail.before as string[][]))
        break
    }
    this._jumpToCell(details[details.length - 1])
  }

  public redo () {
    if (this._pointer >= this._histories.length) return

    const history = this._histories[this._pointer++]
    const details = history.details

    switch (history.operation) {
      case operations.EDIT:
        details.forEach(detail => this._editCell(detail, detail.after as string))
        break
      case operations.ROW_INSERT:
        details.forEach(detail => this._spliceRow(detail, new Array(detail.amount).fill('')))
        break
      case operations.ROW_REMOVE:
        this._spliceRow(details[0], details[0].amount!)
        break
      case operations.COL_INSERT:
        details.forEach(detail => this._spliceCol(detail, new Array(detail.amount).fill('')))
        break
      case operations.COL_REMOVE:
        details.forEach(detail => this._spliceCol(detail, detail.amount!))
        break
    }
    this._jumpToCell(details[details.length - 1])
  }
}
