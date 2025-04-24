import * as path from 'path'
import { app, MenuItem } from 'electron'
import HelpMenu from '@/main/menu/HelpMenu'

app.setAboutPanelOptions({
  applicationName: app.getName(),
  applicationVersion: app.getVersion(),
  authors: ['Masaki Enomoto'],
  website: 'https://www.plus-one.tech',
  iconPath: app.isPackaged ? path.join(process.resourcesPath, 'public/icon.png') : 'icon.png',
})

export default class AppMenu {
  public static createMenu () {
    const menu = new HelpMenu()
    return new MenuItem({
      label: app.name,
      submenu: [
        {
          label: 'このソフトについて',
          role: 'about',
          click: menu.about,
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
        //   click: FileMenu.openSettingsWindow,
        // },
        { type: 'separator' },
        {
          label: '終了',
          role: 'quit',
        },
      ],
    })
  }
}
