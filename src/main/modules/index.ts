import CSVFile from '@/main/modules/CSVFile'
import History from '@/main/modules/History'

type Module = {
  csvFile: CSVFile,
  history: History,
}

const modules: Module = {
  csvFile: new CSVFile(),
  history: new History(),
}

export const getModule = <K extends keyof Module>(key: K): Module[K] => {
  return modules[key]
}
