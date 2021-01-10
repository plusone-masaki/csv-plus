import Electron, { app, Menu } from 'electron'
// import { i18next } from '@/plugins/i18n'
import FileMenu from '@/main/menu/FileMenu'

const isMac = process.platform === 'darwin'

const fileMenu = new FileMenu()

const template: Array<Electron.MenuItemConstructorOptions|Electron.MenuItem> = isMac
  ? [
    {
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        // { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
  ]
  : [
    {
      label: 'ファイル(F)',
      accelerator: 'Alt+F',
      submenu: [
        {
          label: '新規作成',
          accelerator: 'Alt+Insert',
        },
        { type: 'separator' },
        {
          label: 'ファイルを開く',
          accelerator: 'Ctrl+O',
          click: fileMenu.open,
        },
        { type: 'separator' },
        {
          label: '上書き保存',
          accelerator: 'Ctrl+S',
        },
        {
          label: '名前を付けて保存',
          accelerator: 'Ctrl+Shift+S',
        },
      ],
    },
    {
      label: '編集(E)',
      accelerator: 'Alt+E',
      submenu: [
        {
          label: '元に戻す',
          role: 'undo',
        },
        {
          label: 'やり直し',
          role: 'redo',
        },
        { type: 'separator' },
        {
          label: '切り取り',
          role: 'cut',
        },
        {
          label: 'コピー',
          role: 'copy',
        },
        {
          label: '貼り付け',
          role: 'paste',
        },
        { type: 'separator' },
        {
          label: '全て選択',
          role: 'selectAll',
        },
      ],
    },
    {
      label: 'ヘルプ(H)',
      role: 'help',
      accelerator: 'Alt+H',
      submenu: [
        {
          label: 'このソフトについて',
          click: async () => {
            const { shell } = require('electron')
            await shell.openExternal('https://electronjs.org')
          },
        },
      ],
    },
  ]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
