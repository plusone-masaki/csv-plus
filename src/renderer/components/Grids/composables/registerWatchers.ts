import {
  nextTick,
  Ref,
  SetupContext,
  watch,
} from 'vue'
import HandsOnTable from 'handsontable'
import { Props } from './types'

type Refs = {
  table: Ref<HandsOnTable|null>;
  search: Ref<HandsOnTable.plugins.Search|null>;
  filter: Ref<HandsOnTable.plugins.Filters|null>;
  wrapper: Ref<HTMLDivElement|undefined>;
  settings: Ref<HandsOnTable.GridSettings>;
}

export default (props: Props, context: SetupContext, refs: Refs) => {
  watch(() => props.path, () => {
    if (refs.table.value) refs.table.value.loadData(props.data)
  })

  watch(() => props.active, async active => {
    if (active && refs.table.value) {
      await nextTick()
      refs.table.value.render()
    }
  })

  watch(() => refs.settings.value, settings => {
    if (refs.table.value) refs.table.value.updateSettings(settings)
  })

  // Search
  watch(() => props.keyword, keyword => {
    if (refs.table.value && refs.search.value) {
      refs.search.value.query(keyword)
      refs.table.value.render()
    }
  })
}
