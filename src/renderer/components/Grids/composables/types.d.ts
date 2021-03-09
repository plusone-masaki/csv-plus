import HandsOnTable from 'handsontable'
import { Options } from '@/renderer/types'

export type Props = {
  data: HandsOnTable.CellValue[][] | HandsOnTable.RowObject[];
  options: Options;
  path: string;
  active: boolean;
  keyword: string;
}
