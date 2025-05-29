import * as os from 'os'
import * as pathModule from 'path'
import { vi } from 'vitest'

export const app = {
  getName: () => 'CSV+',
  getVersion: () => process.env.npm_package_version,
  getPath: vi.fn((path: string) => pathModule.join(os.tmpdir(), 'test', path)),
  setAboutPanelOptions: vi.fn(),
}

export const dialog = {
  showMessageBox: vi.fn(),
  showErrorBox: vi.fn(),
}

export const BrowserWindow = vi.fn()

export default {
  app,
  dialog,
  BrowserWindow,
}
