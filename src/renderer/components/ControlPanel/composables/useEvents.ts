import { SetupContext, WritableComputedRef } from 'vue'
import { Options, Table } from '@/common/types'

export default (
  props: Readonly<{ modelValue: Options; table: Table|undefined }>,
  context: SetupContext, options: WritableComputedRef<Options>,
) => {
  return {
    add: () => context.emit('add'),
    save: () => context.emit('save'),
    open: () => context.emit('open'),
    print: () => {
      if (props.table?.instance) {
        props.table.instance.addHookOnce('afterRender', () => window.print())
        options.value.printMode = true
      }
    },
  }
}
