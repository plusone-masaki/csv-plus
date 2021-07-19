import { ref, WritableComputedRef } from 'vue'
import { FileData, Options, Tab } from '@/@types/types'

export type UseTab = {
  state: {
    count: ref<number>
    activeId: number
    tabs: Tab[]
  }

  options: ref<Options>
  activeTab: WritableComputedRef<Tab|undefined>

  onEdit: () => void
  addTab: (fileData?: FileData) => void
  closeTab: (tab: Tab) => void
}
