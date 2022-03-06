import * as path from 'path'
import { app, protocol, BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
// import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import '@/main/plugins/i18n'
import * as browserWindow from '@/common/browserWindow'
import * as channels from '@/common/channels'
import CSVFile from '@/main/models/CSVFile'
import History from '@/main/models/History'
import browserEvents from '@/main/system/browserEvents'
import './ipcEvents'

const isDevelopment = process.env.NODE_ENV !== 'production'
const csvFile = new CSVFile()
let window: BrowserWindow
let filepath: string

app.setName('CSV+')

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
])

const isFirstInstance = app.requestSingleInstanceLock()
if (!isFirstInstance) {
  app.quit()
} else {
  app.on('second-instance', (event, argv: string[]) => {
    if (argv.length >= 2 && argv[argv.length - 1].indexOf('--')) filepath = argv[argv.length - 1]
    if (filepath && filepath !== 'dist') csvFile.open(filepath)
    if (window) {
      if (window.isMinimized()) window.restore()
      window.focus()
    }
  })
}

async function createWindow () {
  // Create the browser window.
  window = new BrowserWindow({
    title: 'CSV+',
    width: browserWindow.WIDTH,
    height: browserWindow.HEIGHT,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.resolve(__dirname, 'preloadApp.js'),
    },
    icon: app.isPackaged ? path.join(process.resourcesPath, 'public/icon.png') : path.join(__static, 'icon.png'),
  })

  browserEvents(window)

  // File load from arguments
  window.webContents.on('did-finish-load', async () => {
    csvFile.setWindow(window)

    // 前回開いていたタブの復元
    const paths: string[] = History.tabHistory

    // ファイルを開こうとしている場合読み込み
    const argv = process.argv
    if (argv.length >= 2 && argv[1]) filepath = argv[1]
    if (filepath && filepath !== 'dist' && !paths.includes(filepath)) paths.push(filepath)

    const loadingFiles: Promise<void>[] = []
    paths.forEach(path => loadingFiles.push(csvFile.open(path)))

    // 全てのタブが開き終わったら元の順番に並び替え
    await Promise.all(loadingFiles)
    window.webContents.send(channels.TABS_LOADED, paths, filepath)
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await window.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) window.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    await window.loadURL('app://./index.html')
  }
}

app.on('will-finish-launching', () => {
  /**
   * MacOSでファイルからアプリを開いた場合
   *
   * @param {Event} e
   * @param {string} path
   */
  app.on('open-file', (e, path) => {
    e.preventDefault()
    filepath = path

    if (window && window.isDestroyed()) return createWindow()
  })
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) return createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  // if (isDevelopment && !process.env.IS_TEST) {
  //   // Install Vue Devtools
  //   try {
  //     await installExtension(VUEJS_DEVTOOLS)
  //   } catch (e) {
  //     console.error('Vue Devtools failed to install:', e.toString())
  //   }
  // }
  return createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        History.persistentRecentDocuments()
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      History.persistentRecentDocuments()
      app.quit()
    })
  }
}
