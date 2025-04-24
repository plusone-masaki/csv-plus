import * as path from 'path'
import { app, BrowserWindow, MenuItem, MenuItemConstructorOptions } from 'electron'
import { menu } from '@/main/menu/index'
import { getModule } from '@/main/modules'

const config = getModule('config')
const updateChecker = getModule('updateChecker')

app.setAboutPanelOptions({
  applicationName: app.getName(),
  applicationVersion: app.getVersion(),
  authors: ['Masaki Enomoto'],
  website: 'https://www.plus-one.tech',
  iconPath: app.isPackaged ? path.join(process.resourcesPath, 'public/icon.png') : 'icon.png',
})

export default class HelpMenu {
  public static createMenu () {
    const menu = new HelpMenu()
    const isMac = process.platform === 'darwin'
    const config = getModule('config')

    const about: MenuItemConstructorOptions[] = isMac
      ? []
      : [{
          label: 'このソフトについて',
          role: 'about',
          click: menu.about,
        }]

    return new MenuItem({
      label: 'ヘルプ',
      role: 'help',
      submenu: [
        ...about,
        {
          id: 'update-notification',
          label: '更新通知を受け取る',
          type: 'checkbox',
          checked: config.updateNotification,
          click: menu.updateNotification,
        },
        {
          id: 'check-update',
          label: 'アップデートを確認する',
          click: menu.checkUpdate,
        },
      ],
    })
  }

  /**
   * [このアプリについて]
   */
  public about () {
    app.showAboutPanel()
  }

  /**
   * 「更新通知を受け取る」
   */
  public updateNotification (menuItem: MenuItem): void {
    const checkbox = menuItem.menu.getMenuItemById('update-notification')
    config.updateNotification = checkbox!.checked
  }

  /**
   * 「更新通知を受け取る」をオフにする
   */
  public disableUpdateNotification () {
    const checkbox = menu.getMenuItemById('update-notification')
    checkbox!.checked = false
    config.updateNotification = checkbox!.checked
  }

  public checkUpdate (menuItem: MenuItem, window?: BrowserWindow) {
    updateChecker.checkUpdate(window)
  }
}
