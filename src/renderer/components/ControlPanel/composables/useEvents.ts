import { SetupContext } from 'vue'
import { Options, Table } from '@/common/types'

export default (
  props: Readonly<{ modelValue: Options; table: Table|undefined }>,
  context: SetupContext,
) => {
  return {
    add: () => context.emit('add'),
    save: () => context.emit('save'),
    open: () => context.emit('open'),
    print: () => context.emit('print'),
  }
}
