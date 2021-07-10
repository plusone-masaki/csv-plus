import { SetupContext } from 'vue'
import { Props } from './types'

export default (props: Props, context: SetupContext) => ({
  afterChange: (_: unknown, src: string) => {
    if (!['loadData'].includes(src)) context.emit('edit')
  },
  afterSelection: (startRow: number, startCol: number, endRow: number, endCol: number) => {
    if (!props.table) return

    const rowLength = endRow - startRow
    const colLength = endCol - startCol

    const values = props.table.getData(startRow, startCol, endRow, endCol).flat() as string[]
    props.calculation.selected = {
      rowLength,
      colLength,
      summary: (rowLength || colLength) && values.reduce((a, b) => a + Number(b), 0),
    }
  },
})
