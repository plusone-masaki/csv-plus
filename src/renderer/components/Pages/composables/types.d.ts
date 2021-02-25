import { reactive, ref } from 'vue'
import { FileData, Options } from '@/renderer/types'

export type Tabs = {
  state: reactive<{
    count: ref<number>;
    active: string;
    files: FileData[];
  }>;

  options: ref<Options>;

  onEdit: () => void;
  addTab: (fileData?: FileData) => void;
  closeTab: (fileData: FileData) => void;
}
