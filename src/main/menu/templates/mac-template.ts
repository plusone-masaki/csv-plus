import { app } from 'electron'
import FileMenu from '@/main/menu/FileMenu'
import EditMenu from '@/main/menu/EditMenu'
import HelpMenu from '@/main/menu/HelpMenu'

export default [
  {
    label: app.name,
    submenu: [
      {
        label: 'このソフトについて',
        role: 'about',
        click: HelpMenu.about,
      },
      { type: 'separator' },
      {
        label: 'サービス',
        role: 'services',
      },
      { type: 'separator' },
      {
        label: 'このウィンドウを隠す',
        role: 'hide',
      },
      {
        label: '他のウィンドウを隠す',
        role: 'hideothers',
      },
      {
        label: '表示する',
        role: 'unhide',
      },
      { type: 'separator' },
      {
        label: '終了',
        role: 'quit',
      },
    ],
  },
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
] as Electron.MenuItemConstructorOptions[]
