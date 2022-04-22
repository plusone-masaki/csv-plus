import iconv from 'iconv-lite'
import jconv from 'jconv'
import { SupportedEncoding } from '@/@types/types'

export default {
  ...iconv,
  encode: (content: string, encoding: SupportedEncoding, options?: iconv.Options): Buffer => {
    if (['ISO_2022_JP'].includes(encoding)) return jconv.encode(content, 'ISO-2022-JP')

    return iconv.encode(content, encoding, options)
  },
  decode: (content: Buffer, encoding: SupportedEncoding, options?: iconv.Options): string => {
    if (['ISO_2022_JP'].includes(encoding)) return jconv.decode(content, 'ISO-2022-JP')

    return iconv.decode(content, encoding, options)
  },
}
