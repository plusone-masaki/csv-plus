import { plugins } from 'handsontable'
import { SearchOption, TableInstance } from '@/common/types'

interface SearchPlugin extends plugins.Base {
  callback: () => void;
  queryMethod: (query: string, value: string) => boolean;
  searchResultClass: string;

  query(queryStr: string, callback?: () => void, queryMethod?: (query: string, value: string) => boolean): any[];
  getCallback(): () => void;
  setCallback(newCallback: () => void): void;
  getQueryMethod(): (query: string, value: string) => boolean;
  setQueryMethod(newQueryMethod: (query: string, value: string) => boolean): void;
  getSearchResultClass(): string;
  setSearchResultClass(newElementClass: string): void;
}

class Search {
  readonly table: TableInstance
  readonly searchPlugin: SearchPlugin
  readonly customBorders: plugins.CustomBorders

  public constructor (table: TableInstance) {
    this.table = table
    this.searchPlugin = table.getPlugin('search') as any
    /* @ts-ignore */
    this.customBorders = table.getPlugin('customBorders')
    console.log('constructor!', this.table, this.searchPlugin)
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

  public query (option: SearchOption) {
    if (option.enable && this.table && this.searchPlugin) {
      const queryMethod = this._generateQueryMethod(option)

      const results = this.searchPlugin.query(option.keyword, this.searchPlugin.getCallback(), queryMethod)
      console.log(results)
      this.table.render()
    }
  }
}

let instance: Search
export default (table: TableInstance) => {
  instance = new Search(table)
  return (option: SearchOption) => instance.query(option)
}
