import {
  nextTick,
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

  watch(() => props.active, async active => {
    if (active && props.table) {
      context.emit('load', props.table)
      await nextTick()
      props.table.render()
    }
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
}
