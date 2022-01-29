import os from 'os'
import { Linefeed } from '@/@types/types'

export const defaultLinefeed = (): Linefeed => {
  switch (os.EOL) {
    case '\r\n': return 'CRLF'
    case '\n':
    default: return 'LF'
  }
}

export const linefeedChar = (linefeed: string): '\r\n'|'\n' => {
  switch (linefeed) {
    case 'CRLF': return '\r\n'
    case 'LF':
    default: return '\n'
  }
}
