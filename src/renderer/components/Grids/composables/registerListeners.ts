import { Props } from '@/renderer/components/Grids/types'
import { Ref, SetupContext } from 'vue'
import HandsOnTable from 'handsontable'

type Refs = {
  table: Ref<HandsOnTable|null>;
  wrapper: Ref<HTMLDivElement|undefined>;
  settings: Ref<HandsOnTable.GridSettings>;
}

export default (props: Props, context: SetupContext, { table }: Refs) => {
  document.addEventListener('keydown', (event: KeyboardEvent) => {
    console.log(props.active, table.value, event.key, event.ctrlKey, event.shiftKey)
    if (!props.active || !table.value) return

    switch (event.key.toUpperCase()) {
      case 'C': // copy
        if (event.ctrlKey) table.value.getPlugin('copyPaste').copy()
        break
      case 'V': // paste
        if (event.ctrlKey) table.value.getPlugin('copyPaste').paste()
        break
      case 'X': // cut
        if (event.ctrlKey) table.value.getPlugin('copyPaste').cut()
        break
      case 'Z': // undo|redo
        if (event.ctrlKey && event.shiftKey) table.value.redo()
        else if (event.ctrlKey) table.value.undo()
        break
    }
  })
}
