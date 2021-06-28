import { app, MenuItem } from 'electron'
import HelpMenuController from '@/main/menu/controllers/HelpMenuController'

export default new MenuItem({
  label: app.name,
  submenu: [
    {
      label: 'このソフトについて',
      role: 'about',
      click: HelpMenuController.about,
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
      role: 'hideOthers',
    },
    {
      label: '表示する',
      role: 'unhide',
    },
    // { type: 'separator' },
    // {
    //   label: '設定',
    //   click: FileMenuController.openSettingsWindow,
    // },
    { type: 'separator' },
    {
      label: '終了',
      role: 'quit',
    },
  ],
})
