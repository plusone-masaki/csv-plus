import { reactive, ref, WritableComputedRef } from 'vue'
import { FileData, Options, Tab } from '@/common/types'

export type useTab = {
  state: reactive<{
    count: ref<number>;
    active: string;
    tabs: Tab[];
  }>;

  options: ref<Options>;
  activeTab: WritableComputedRef<Tab|undefined>;

  onEdit: () => void;
  addTab: (fileData?: FileData) => void;
  closeTab: (tab: Tab) => void;
}
