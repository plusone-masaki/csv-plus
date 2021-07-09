import { Tab, SearchOption, ReplaceFlag } from '@/common/types'
import { TableInstance, CustomBordersPlugin, SearchPlugin } from '@/common/handsontable'

export const REPLACE_NONE = 0
export const REPLACE_SINGLE = 1
export const REPLACE_ALL = 2

type SearchResult = {
  row: number
  col: number
  data: string
}

class Search {
  readonly table: TableInstance
  readonly searchPlugin: SearchPlugin
  readonly customBordersPlugin: CustomBordersPlugin
  readonly option: SearchOption
  readonly hasHeader: boolean

  private _data: string[][] = []
  private _keyword = ''
  private _matchCase = false
  private _regexp = false
  private _queryDelay: number|undefined
  private _results: SearchResult[] = []

  public constructor (table: TableInstance, tab: Tab) {
    this.table = table
    this.searchPlugin = table.getPlugin('search') as any as SearchPlugin
    /* @ts-ignore */
    this.customBordersPlugin = table.getPlugin('customBorders') as any as customBordersPlugin
    this.option = tab.table.options.search
    this.hasHeader = tab.table.options.hasHeader
    this._data = tab.file.data

    this.query()
  }

  private _isUndefined = (value?: unknown): boolean => typeof value === 'undefined'

  private _generateQueryMethod (option: SearchOption) {
    return (query: string, value: string) => {
      try {
        if (this._isUndefined(query) || query === null || !query.toLowerCase || query.length === 0) return false
        if (this._isUndefined(value) || value === null) return false

        // 正規表現検索
        if (option.regexp) {
          const regexQuery = new RegExp(query, option.matchCase ? '' : 'i')
          return regexQuery.test(value)
        }

        if (!option.matchCase) {
          query = query.toLowerCase()
          value = value.toLowerCase()
        }

        return value.toString().indexOf(query) !== -1
      } catch (e) {
        return false
      }
    }
  }

  /**
   * 検索に一致したセルをフォーカスする
   *
   * @private
   */
  private _focusCell (reverse: boolean, preserveCursor: boolean, force = false) {
    // 検索条件が変わっている場合、結果が出るまでフォーカス処理をスキップ
    if (!force && (
      this._keyword !== this.option.keyword ||
      this._matchCase !== this.option.matchCase ||
      this._regexp !== this.option.regexp
    )) return

    if (
      this._keyword === this.option.keyword &&
      this._matchCase === this.option.matchCase &&
      this._regexp === this.option.regexp &&
      this._results.length
    ) { // 前回と同じ検索内容であれば、フォーカスを移動させる
      this.option.results = {
        length: this._results.length,
        current: this.option.results?.current ?? -1,
      }

      const selectedCell = this.table.getSelectedLast()
      if (selectedCell) { // セルを選択状態の場合、それよりも後のセルをフォーカス
        const ROW = 0
        const COL = 1
        if (reverse) {
          const index = this._results
            .slice()
            .reverse()
            .findIndex(r => ((r.row === selectedCell[ROW] && r.col <= selectedCell[COL])) || (r.row < selectedCell[ROW]))
          this.option.results.current = this._results.length - index - 1
        } else {
          this.option.results.current = this._results
            .findIndex(r => ((r.row === selectedCell[ROW] && r.col >= selectedCell[COL])) || (r.row > selectedCell[ROW]))
        }
      } else if (preserveCursor) { // 前回と同じセルをフォーカス
        // no change
      } else if (reverse) { // 上へ検索
        this.option.results.current -= 1
      } else { // 下へ検索
        this.option.results.current += 1
      }

      if (this.option.results.current < 0 || this.option.results.current >= this._results.length) {
        this.option.results.current = reverse ? this._results.length - 1 : 0
      }
    } else if (this._results.length) {
      this.option.results = {
        length: this._results.length,
        current: 0,
      }
    } else {
      this.option.results = undefined
    }

    // 検索内容の保持
    this._keyword = this.option.keyword
    this._matchCase = this.option.matchCase
    this._regexp = this.option.regexp

    this.table.deselectCell()
    this.customBordersPlugin.clearBorders()
    if (this.option.results) {
      const result = this._results[this.option.results.current]
      const border = { width: 2, color: 'rgb(75, 137, 255)' }
      this.table.scrollViewportTo(result.row, result.col, !reverse, !reverse)
      this.customBordersPlugin.setBorders(
        [[result.row, result.col, result.row, result.col]],
        { top: border, bottom: border, left: border, right: border },
      )
    }
  }

  /**
   * 置換処理
   *
   * @private
   */
  private _replace (type: ReplaceFlag) {
    if (!this.option.results) return

    // 置換対象のセル
    let cells: SearchResult[] = []
    switch (type) {
      case REPLACE_SINGLE:
        cells = [this._results[this.option.results.current]]
        break
      case REPLACE_ALL:
        cells = this._results
        break
      default:
        return
    }

    console.log('cells', cells)
    const query = this.option.regexp ? new RegExp(this._keyword, this.option.matchCase ? '' : 'i') : this._keyword
    cells.forEach(cell => {
      const row = this.hasHeader ? cell.row + 1 : cell.row
      this._data[row][cell.col] = this._data[row][cell.col].replace(query, this.option.replace)
    })
  }

  public query (reverse = false, preserveCursor = false, replace: ReplaceFlag = REPLACE_NONE) {
    // イベント発火のたびに検索処理を行うと重いためディレイを設ける
    clearTimeout(this._queryDelay)
    this._queryDelay = window.setTimeout(() => {
      if (this.option.enable && this.table && this.searchPlugin) {
        const queryMethod = this._generateQueryMethod(this.option)

        this._results = this.searchPlugin.query(this.option.keyword, this.searchPlugin.getCallback(), queryMethod)
        this.table.render()
        this._focusCell(reverse, true, true)
      }
    }, 50)

    // 置換処理
    if (this._results.length && replace !== REPLACE_NONE) this._replace(replace)

    // フォーカス処理
    this._focusCell(reverse, preserveCursor)
  }
}

let instance: Search
export default (table: TableInstance, tab: Tab) => {
  instance = new Search(table, tab)
  return (reverse?: boolean, preserveCursor?: boolean, replace?: ReplaceFlag) => instance.query(reverse, preserveCursor, replace)
}
