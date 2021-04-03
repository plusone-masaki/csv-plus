import HandsOnTable from 'handsontable'

declare type Linefeed = 'CR' | 'CRLF' | 'LF'

declare interface FileMeta {
  delimiter: string;
  quoteChar: string;
  escapeChar: string;
  encoding: string;
  linefeed: Linefeed;
}

declare interface FileData {
  label: string;
  path: string;
  data: HandsOnTable.CellValue[][] | HandsOnTable.RowObject[];
  meta: FileMeta;
}

declare interface Options {
  hasHeader: boolean;
  search: boolean;
  printMode: boolean;
}

declare interface Calculation {
  selected: {
    rowLength: number;
    colLength: number;
    summary: number;
  };
}

declare interface Tab {
  id: number;
  table: HandsOnTable | null;
  dirty: boolean;
  file: FileData;
  options: Options;
  calculation: Calculation;
}
