import { TFunction } from 'i18next'
import HandsOnTable from 'handsontable'
import { TableInstance, CustomBordersPlugin } from '@/@types/handsontable'
import UndoRedo from '@/renderer/plugins/UndoRedo'

declare global {
  const __: TFunction
  const __static: string

  namespace NodeJS {
    declare interface Global {
      __: TFunction
    }
  }
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

type REPLACE_NONE = 0
type REPLACE_SINGLE = 1
type REPLACE_ALL = 2

declare type ReplaceFlag = REPLACE_NONE|REPLACE_SINGLE|REPLACE_ALL

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

interface SearchResults {
  length: number
  current: number
}

declare interface SearchOption {
  enable: boolean
  enableReplace: boolean
  matchCase: boolean
  regexp: boolean
  keyword: string
  replace: string
  results?: SearchResults
}

declare interface Options {
  hasHeader: boolean
  printMode: boolean
  search: SearchOption
}

declare interface Table {
  instance?: TableInstance
  search: (reverse?: boolean, preserve?: boolean, replace?: ReplaceFlag) => void
  undoRedo?: UndoRedo
  borders?: CustomBordersPlugin
  options: Options
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
  table: Table
  dirty: boolean
  file: FileData
  calculation: Calculation
}

declare interface ConfigData {
  updateNotification: boolean
}
