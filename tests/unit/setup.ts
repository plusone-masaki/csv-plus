import 'regenerator-runtime/runtime'
import fs from 'fs'
import path from 'path'
import os from 'os'

const testDir = path.resolve(os.tmpdir(), 'test')
if (fs.existsSync(testDir)) {
  fs.rmSync(testDir, { recursive: true })
}

fs.mkdirSync(testDir)
