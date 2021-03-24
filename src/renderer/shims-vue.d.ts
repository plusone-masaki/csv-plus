declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.json' {
  const data: any
  export default data
}

declare module 'handsontable/plugins' {
  import HandsOnTable from 'handsontable'
  export = HandsOnTable.plugins
}
