import Config from '@/main/modules/Config'
import CSVFile from '@/main/modules/CSVFile'
import History from '@/main/modules/History'
import UpdateChecker from '@/main/modules/UpdateChecker'

type Module = {
  config: Config
  csvFile: CSVFile
  history: History
  updateChecker: UpdateChecker
}

const modules: Module = {
  config: new Config(),
  csvFile: new CSVFile(),
  history: new History(),
  updateChecker: new UpdateChecker(),
}

export const getModule = <K extends keyof Module>(key: K): Module[K] => {
  return modules[key]
}
