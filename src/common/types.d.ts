import HandsOnTable, { plugins } from 'handsontable'

declare global {
  const __static: string
}

declare type Linefeed = 'CRLF' | 'LF'
declare type SupportedEncoding =
  'UTF-8' |
  'UTF-16' |
  'UTF-16LE' |
  'UTF-16BE' |
  'UTF-32' |
  'UTF-32LE' |
  'UTF-32BE' |
  'Shift_JIS' |
  'Big5' |
  'EUC-JP' |
  'EUC-KR' |
  'GB18030' |
  'ISO_2022_JP' |
  'ISO_2022_CN' |
  'ISO_2022_KR' |
  'ISO-8859-1' |
  'ISO-8859-2' |
  'ISO-8859-5' |
  'ISO-8859-6' |
  'ISO-8859-7' |
  'ISO-8859-8' |
  'ISO-8859-9' |
  'windows-1250' |
  'windows-1251' |
  'windows-1252' |
  'windows-1253' |
  'windows-1254' |
  'windows-1255' |
  'windows-1256' |
  'KOI8-R' |
  ''

declare interface KeyBind {
  key: string
  shiftKey?: boolean
  ctrlKey?: boolean
  altKey?: boolean
  metaKey?: boolean
}

declare interface ShortcutEvent {
  name: string
  callback: () => void
}

declare interface Table extends HandsOnTable {
  undo: () => void
  redo: () => void
}

declare interface FileMeta {
  delimiter: string
  quoteChar: string
  escapeChar: string
  linefeed: Linefeed
  encoding: SupportedEncoding
  bom: boolean
  colWidth?: number
}

declare interface FileData {
  label: string
  path: string
  data: HandsOnTable.CellValue[][]
  meta: FileMeta
}

declare interface Search extends plugins.Base {
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

declare interface SearchOption {
  enable: boolean
  instance?: Search
  matchCase: boolean
  regexp: boolean
  keyword: string
}

declare interface Options {
  hasHeader: boolean
  search: SearchOption
  printMode: boolean
}

declare interface Calculation {
  selected: {
    rowLength: number
    colLength: number
    summary: number
  }
}

declare interface Tab {
  id: number
  table: Table | null
  dirty: boolean
  file: FileData
  options: Options
  calculation: Calculation
}
