import { Tab } from '@/common/types'
import { WritableComputedRef } from 'vue'
import Shortcut from '@/renderer/utils/Shortcut'

type Models = {
  tabs: WritableComputedRef<Tab[]>;
  activeId: WritableComputedRef<number>;
}

interface Methods {
  onAdd: () => void;
  onClose: (tab: Tab) => void;
}

export default (models: Models, methods: Methods) => {
  Shortcut.addShortcutEvent('tab_close', () => {
    const activeTab = models.tabs.value.find(tab => tab.id === models.activeId.value)
    if (activeTab) methods.onClose(activeTab)
  })
}
