import { SetupContext } from 'vue'

export default (context: SetupContext) => ({
  add: () => context.emit('add'),
  save: () => context.emit('save'),
  open: () => context.emit('open'),
})
