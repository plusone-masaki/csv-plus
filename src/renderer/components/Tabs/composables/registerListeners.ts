import { Tab } from '@/common/types'
import { WritableComputedRef } from 'vue'

type Models = {
  tabs: WritableComputedRef<Tab[]>;
  activeId: WritableComputedRef<number>;
}

interface Methods {
  onAdd: () => void;
  onClose: (tab: Tab) => void;
}

export default (models: Models, methods: Methods) => {
  /**
   * Key bindings
   */
  document.addEventListener('keydown', (event: KeyboardEvent) => {
    switch (event.key.toUpperCase()) {
      // tab-close
      case 'F4': {
        const activeTab: Tab|undefined = models.tabs.value.find(tab => tab.id === models.activeId.value)
        if (event.ctrlKey && activeTab) methods.onClose(activeTab)
        break
      }
    }
  })
}
