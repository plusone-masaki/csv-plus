import HandsOnTable from 'handsontable'
import { FileData, Options } from '@/common/types'

export type Props = {
  table: HandsOnTable | null;
  file: FileData;
  keyword: string;
  options: Options;
}
