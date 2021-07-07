import { SearchOption, Table } from '@/common/types'

const isUndefined = (value?: unknown): boolean => typeof value === 'undefined'

const generateQueryMethod = (searchOption: SearchOption) => (query: string, value: string) => {
  try {
    if (isUndefined(query) || query === null || !query.toLowerCase || query.length === 0) return false
    if (isUndefined(value) || value === null) return false

    // 正規表現検索
    if (searchOption.regexp) {
      const regexQuery = new RegExp(query, searchOption.matchCase ? '' : 'i')
      return regexQuery.test(value)
    }

    if (!searchOption.matchCase) {
      query = query.toLowerCase()
      value = value.toLowerCase()
    }

    return value.toString().indexOf(query) !== -1
  } catch (e) {
    return false
  }
}

export default (table: Table|null, search: SearchOption) => {
  if (table && search.enable && search.instance) {
    const queryMethod = generateQueryMethod(search)

    search.instance.query(search.keyword, search.instance.getCallback(), queryMethod)
    table.render()
  }
}
