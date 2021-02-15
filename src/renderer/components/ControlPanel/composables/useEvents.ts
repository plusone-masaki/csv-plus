import { SetupContext } from 'vue'

export default (context: SetupContext) => ({
  new: () => context.emit('new'),
  save: () => context.emit('save'),
  open: () => context.emit('open'),
})
