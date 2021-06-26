import * as types from '@/common/types'

export type Props = {
  table: types.Table | null
  file: types.FileData
  keyword: string
  options: types.Options
  calculation: types.Calculation
}
