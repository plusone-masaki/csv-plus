import HandsOnTable, { plugins } from 'handsontable'

declare interface CustomBordersPlugin extends plugins.Base {
  savedBorderSettings: any[];

  setBorders(selection: Range[] | Array<[number, number, number, number]>, borderObject: object): void;
  getBorders(selection: Range[] | Array<[number, number, number, number]>): Array<[object]>;
  clearBorders(selection?: Range[] | Array<[number, number, number, number]>): void;
}

declare interface SearchPlugin extends plugins.Base {
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

// Plugin collection, map for getPlugin method
interface PluginsCollection {
  autoColumnSize: plugins.AutoColumnSize,
  autofill: plugins.Autofill,
  autoRowSize: plugins.AutoRowSize,
  bindRowsWithHeaders: plugins.BindRowsWithHeaders,
  collapsibleColumns: plugins.CollapsibleColumns,
  columnSorting: plugins.ColumnSorting,
  columnSummary: plugins.ColumnSummary,
  comments: plugins.Comments,
  contextMenu: plugins.ContextMenu,
  copyPaste: plugins.CopyPaste,
  customBorders: CustomBordersPlugin,
  dragToScroll: plugins.DragToScroll,
  dropdownMenu: plugins.DropdownMenu,
  exportFile: plugins.ExportFile,
  filters: plugins.Filters,
  formulas: plugins.Formulas,
  ganttChart: plugins.GanttChart,
  headerTooltips: plugins.HeaderTooltips,
  hiddenColumns: plugins.HiddenColumns,
  hiddenRows: plugins.HiddenRows,
  manualColumnFreeze: plugins.ManualColumnFreeze,
  manualColumnMove: plugins.ManualColumnMove,
  manualColumnResize: plugins.ManualColumnResize,
  manualRowMove: plugins.ManualRowMove,
  manualRowResize: plugins.ManualRowResize;
  mergeCells: plugins.MergeCells;
  multiColumnSorting: plugins.MultiColumnSorting,
  multipleSelectionHandles: plugins.MultipleSelectionHandles,
  nestedHeaders: plugins.NestedHeaders,
  nestedRows: plugins.NestedRows,
  observeChanges: plugins.ObserveChanges,
  search: SearchPlugin,
  touchScroll: plugins.TouchScroll,
  trimRows: plugins.TrimRows,
}

declare interface TableInstance extends HandsOnTable {
  undo: () => void
  redo: () => void
  getPlugin<T extends keyof PluginsCollection>(pluginName: T): PluginsCollection[T];
}
