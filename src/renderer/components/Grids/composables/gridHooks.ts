import { SetupContext } from 'vue'
import { Tab } from '@/@types/types'
import shortcut from '@/renderer/models/Shortcut'

export default (props: { tab: Tab }, context: SetupContext) => ({
  afterChange: (_: unknown, src: string) => {
    if (!['loadData', 'undo'].includes(src)) context.emit('edit')
  },
  afterSelection: (startRow: number, startCol: number, endRow: number, endCol: number) => {
    if (!props.tab.table.instance) return

    const rowLength = endRow - startRow
    const colLength = endCol - startCol

    const values = props.tab.table.instance.getData(startRow, startCol, endRow, endCol).flat() as string[]
    props.tab.calculation.selected = {
      rowLength,
      colLength,
      summary: (rowLength || colLength) && values.reduce((a, b) => a + Number(b), 0),
    }
  },
  beforeSetRangeEnd: () => props.tab.table.borders?.clearBorders(),
  beforeKeyDown: (event: Event) => {
    // キーバインドが登録済みの場合、HandsOnTableのキーバインディングを無効化
    if (shortcut.existsKeyBinding(event as KeyboardEvent)) {
      (event as any).isImmediatePropagationEnabled = false;
      (event as any).isImmediatePropagationStopped = () => true
    }
  },
})
