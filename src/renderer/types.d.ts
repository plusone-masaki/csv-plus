import HandsOnTable from 'handsontable'

declare type Options = {
  hasHeader: boolean;
  search: boolean;
}

declare type FileMeta = {
  delimiter: string;
  quoteChar: string;
  escapeChar: string;
  encoding: string;
}

declare type FileData = {
  label: string;
  path: string;
  data: HandsOnTable.CellValue[][] | HandsOnTable.RowObject[];
  meta: FileMeta;
}

declare type Tab = {
  id: number;
  table: HandsOnTable | null;
  dirty: boolean;
  file: FileData;
  options: Options;
}
