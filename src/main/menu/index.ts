import Electron, { app, Menu } from 'electron'
// import { i18next } from '@/plugins/i18n'
import FileMenu from '@/main/menu/FileMenu'
import EditMenu from '@/main/menu/EditMenu'

const isMac = process.platform === 'darwin'

const template: Array<Electron.MenuItemConstructorOptions|Electron.MenuItem> = [
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' },
    ],
  }] : []),
  {
    label: 'ファイル',
    submenu: [
      {
        label: '新規作成',
        accelerator: 'Alt+Insert',
      },
      { type: 'separator' },
      {
        label: 'ファイルを開く',
        accelerator: 'Ctrl+O',
        click: FileMenu.open,
      },
      { type: 'separator' },
      {
        label: '上書き保存',
        accelerator: 'Ctrl+S',
        click: FileMenu.save,
      },
      {
        label: '名前を付けて保存',
        accelerator: 'Ctrl+Shift+S',
        click: FileMenu.saveAs,
      },
      { type: 'separator' },
      {
        label: '閉じる',
        role: 'quit',
      },
    ],
  },
  {
    label: '編集',
    submenu: [
      {
        label: '元に戻す',
        accelerator: 'Ctrl+Z',
        click: EditMenu.undo,
      },
      {
        label: 'やり直し',
        accelerator: 'Ctrl+Shift+Z',
        click: EditMenu.redo,
      },
      { type: 'separator' },
      {
        label: '全て選択',
        accelerator: 'Ctrl+A',
        click: EditMenu.selectAll,
      },
    ],
  },
  {
    label: 'ヘルプ',
    role: 'help',
    submenu: [
      {
        label: 'このソフトについて',
        role: 'about',
      },
    ],
  },
] as Electron.MenuItemConstructorOptions[]

const index = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(index)
