import * as path from 'path'
import { app, protocol } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
// import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import '@/main/plugins/i18n'
import * as browserWindow from '@/common/browserWindow'
import * as channels from '@/assets/constants/channels'
import EditorWindow from '@/main/modules/EditorWindow'
import browserHooks from '@/main/hooks/browser-hooks'
import '@/main/hooks/ipc-hooks'
import { getModule } from '@/main/modules'
import { FileData } from '@/@types/types'

const csvFile = getModule('csvFile')
const history = getModule('history')

let window: EditorWindow
let filepath: string

async function createWindow () {
  // Create the browser window.
  window = EditorWindow.make({
    title: 'CSV+',
    width: browserWindow.WIDTH,
    height: browserWindow.HEIGHT,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.resolve(__dirname, 'preload-app.js'),
    },
    icon: app.isPackaged ? path.join(process.resourcesPath, 'public/icon.png') : path.join(__static, 'icon.png'),
  })

  browserHooks(window)

  // File load from arguments
  window.webContents.on('did-finish-load', async () => {
    // 前回開いていたタブの復元
    const paths = history.tabHistory

    // ファイルを開こうとしている場合読み込み
    const argv = process.argv
    if (argv.length >= 2 && argv[1]) filepath = argv[1]
    if (filepath && filepath !== 'dist' && !paths.includes(filepath)) paths.push(filepath)

    const loadingFiles: Promise<FileData|undefined>[] = []
    paths.forEach(path => loadingFiles.push(csvFile.load(path)))

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

if (!app.requestSingleInstanceLock()) {
  app.quit()
} else {
  app.setName('CSV+')

  // Scheme must be registered before the app is ready
  protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true } },
  ])

  app.on('second-instance', (event, argv: string[]) => {
    if (argv.length >= 2 && argv[argv.length - 1].indexOf('--')) filepath = argv[argv.length - 1]
    if (window) {
      if (filepath && filepath !== 'dist') csvFile.load(filepath)
      if (window.isMinimized()) window.restore()
      window.focus()
    }
  })

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

      if (!window || window.isDestroyed()) return createWindow()
    })
  })

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    history.persistentRecentDirectory()
    history.persistentRecentDocuments()

    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (EditorWindow.getAllWindows().length === 0) return createWindow()
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

  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        history.persistentRecentDirectory()
        history.persistentRecentDocuments()
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      history.persistentRecentDirectory()
      history.persistentRecentDocuments()
      app.quit()
    })
  }
}
