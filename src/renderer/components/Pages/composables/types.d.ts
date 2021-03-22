import { reactive, ref } from 'vue'
import { FileData, Options, Tab } from '@/renderer/types'

export type useTab = {
  state: reactive<{
    count: ref<number>;
    active: string;
    tabs: Tab[];
  }>;

  options: ref<Options>;

  onEdit: () => void;
  addTab: (fileData?: FileData) => void;
  closeTab: (tab: Tab) => void;
}
