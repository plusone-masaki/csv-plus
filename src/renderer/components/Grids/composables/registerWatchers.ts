import {
  Ref,
  SetupContext,
  watch,
} from 'vue'
import HandsOnTable from 'handsontable'
import { Props } from './types'

type Refs = {
  search: Ref<HandsOnTable.plugins.Search|null>;
  filter: Ref<HandsOnTable.plugins.Filters|null>;
  wrapper: Ref<HTMLDivElement|undefined>;
  settings: Ref<HandsOnTable.GridSettings>;
}

export default (props: Props, context: SetupContext, refs: Refs) => {
  watch(() => props.file.path, () => {
    if (props.table) props.table.loadData(props.file.data)
  })

  watch(() => refs.settings.value, settings => {
    if (props.table) props.table.updateSettings(settings)
  })

  // Search
  watch(() => props.keyword, keyword => {
    if (props.table && refs.search.value) {
      refs.search.value.query(keyword)
      props.table.render()
    }
  })

  watch(() => props.options.search, show => {
    if (props.table && refs.search.value) {
      refs.search.value.query(show ? props.keyword : '')
      props.table.render()
    }
  })
}
