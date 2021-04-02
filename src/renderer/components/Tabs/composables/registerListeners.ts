import { Tab } from '@/renderer/types'
import { WritableComputedRef } from 'vue'

type Models = {
  tabs: WritableComputedRef<Tab[]>;
  activeTab: WritableComputedRef<string>;
}

type Methods = {
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
        const activeTab: Tab|undefined = models.tabs.value.find(tab => tab.file.path === models.activeTab.value)
        if (event.ctrlKey && activeTab) methods.onClose(activeTab)
        break
      }
    }
  })
}
