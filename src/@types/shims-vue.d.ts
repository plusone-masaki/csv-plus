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

declare type SanitizeOption = {
  allowedTags?: boolean|{ [key: string]: string }[],
  allowedAttributes?: boolean|{ [key: string]: string },
}

declare module 'sanitize-html' {
  const sanitizeHtml: (str: string, options?: SanitizeOption) => string
  export default sanitizeHtml
}
