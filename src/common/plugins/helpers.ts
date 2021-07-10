import os from 'os'
import { Linefeed } from '@/common/types'

export const defaultLinefeed = (): Linefeed => {
  switch (os.EOL) {
    case '\r\n': return 'CRLF'
    case '\n':
    default: return 'LF'
  }
}
