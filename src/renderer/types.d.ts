import HandsOnTable from 'handsontable'

declare type Setting = {
  hasHeader: boolean;
  delimiter: string;
  quoteChar: string;
  escapeChar: string;
}

declare type FileData = {
  label: string;
  path: string;
  dirty: boolean;
  data: HandsOnTable.CellValue[][] | HandsOnTable.RowObject[];
  setting: Setting;
}
