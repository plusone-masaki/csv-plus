import { Options } from '@/renderer/types'
import { WritableComputedRef } from 'vue'

export default (options: WritableComputedRef<Options>) => {
  document.addEventListener('keydown', (event: KeyboardEvent) => {
    switch (event.key.toUpperCase()) {
      case 'F': // Show search box
        if (event.ctrlKey) options.value.search = !options.value.search
        break
    }
  })
}
