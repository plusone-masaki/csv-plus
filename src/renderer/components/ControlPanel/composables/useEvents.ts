import { SetupContext, WritableComputedRef } from 'vue'
import { Options } from '@/common/types'
import HandsOnTable from 'handsontable'

export default (
  props: Readonly<{ modelValue: Options; table: HandsOnTable|null }>,
  context: SetupContext, options: WritableComputedRef<Options>,
) => {
  return {
    add: () => context.emit('add'),
    save: () => context.emit('save'),
    open: () => context.emit('open'),
    print: () => {
      if (props.table) {
        props.table.addHookOnce('afterRender', () => window.print())
        options.value.printMode = true
      }
    },
  }
}
