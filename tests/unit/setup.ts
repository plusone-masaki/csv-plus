import 'regenerator-runtime/runtime'
import fs from 'fs'
import path from 'path'
import os from 'os'

fs.rmSync(path.join(os.tmpdir(), 'test'), { recursive: true })
fs.mkdirSync(path.join(os.tmpdir(), 'test'))
